import 'dart:async';
import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Top-level background message handler for FCM
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  if (kDebugMode) {
    print("Handling background message ID: ${message.messageId}");
    print("Data payload: ${message.data}");
  }
}

class NotificationService {
  // Singleton instance
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotificationsPlugin = FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// Initialize Firebase Cloud Messaging & Local Notifications for complete foreground handling
  Future<void> initialize() async {
    if (_isInitialized) return;

    // 1. Request appropriate OS system permissions
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (kDebugMode) {
      print('User granted notification authority: ${settings.authorizationStatus}');
    }

    // 2. Set up iOS APNS fore-ground presentation options
    await _fcm.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    // 3. Configure Local Notifications channels for high-priority Android alerting
    const AndroidInitializationSettings androidSetting = AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings iosSetting = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSetting,
      iOS: iosSetting,
    );

    await _localNotificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Android Notification Channel configuration (mandatory since Oreo)
    const AndroidNotificationChannel highPriorityChannel = AndroidNotificationChannel(
      'nulac_high_priority_alerts',
      'Nulac High Priority Notifications',
      description: 'Used for order delivery, express transactions, and launches.',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    await _localNotificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(highPriorityChannel);

    // 4. Initialize FCM Streams
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // Handle Foreground FCM Broadcasts
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (kDebugMode) {
        print("Received FCM message in foreground: ${message.notification?.title}");
      }
      
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;

      // Handle local generation if we want standard banners
      if (notification != null && !kIsWeb) {
        _localNotificationsPlugin.show(
          notification.hashCode,
          notification.title,
          notification.body,
          NotificationDetails(
            android: AndroidNotificationDetails(
              highPriorityChannel.id,
              highPriorityChannel.name,
              channelDescription: highPriorityChannel.description,
              icon: android?.smallIcon ?? '@mipmap/ic_launcher',
              importance: Importance.max,
              priority: Priority.high,
            ),
            iOS: const DarwinNotificationDetails(
              presentAlert: true,
              presentBadge: true,
              presentSound: true,
            ),
          ),
          payload: jsonEncode(message.data),
        );
      }
    });

    // Handle background click on FCM when app was open
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleNotificationRouting(message.data);
    });

    // Check if app was launched via terminal tap
    RemoteMessage? initialMessage = await _fcm.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationRouting(initialMessage.data);
    }

    // 5. Securely subscribe user to general channels
    await _subscribeToDefaultChannels();

    _isInitialized = true;
  }

  /// Recover secure FCM token for delivery to server-side triggers
  Future<String?> getFCMToken() async {
    try {
      String? token = await _fcm.getToken();
      if (kDebugMode) {
        print("Device Secure Firebase FCM Token: $token");
      }
      return token;
    } catch (e) {
      if (kDebugMode) {
        print("Failed to recover Firebase token: $e");
      }
      return null;
    }
  }

  /// Subscribe to specific channels to filter delivery updates vs launches
  Future<void> _subscribeToDefaultChannels() async {
    try {
      await _fcm.subscribeToTopic('order_updates');
      await _fcm.subscribeToTopic('new_launches');
      await _fcm.subscribeToTopic('membership_offers');
      await _fcm.subscribeToTopic('delivery_updates');
    } catch (e) {
      if (kDebugMode) {
        print("Failed to register topics: $e");
      }
    }
  }

  /// Enable / Disable custom topics dynamically
  Future<void> setTopicSubscription(String topic, bool enable) async {
    if (enable) {
      await _fcm.subscribeToTopic(topic);
    } else {
      await _fcm.unsubscribeFromTopic(topic);
    }
  }

  /// Local interaction tap handler
  void _onNotificationTapped(NotificationResponse response) {
    if (response.payload != null) {
      try {
        final Map<String, dynamic> data = jsonDecode(response.payload!);
        _handleNotificationRouting(data);
      } catch (e) {
        if (kDebugMode) {
          print("Error decoding tap payload: $e");
        }
      }
    }
  }

  /// Coordinate router target deep linking based on dynamic payload structures
  void _handleNotificationRouting(Map<String, dynamic> data) {
    final String? route = data['route'];
    final String? actionId = data['id'];
    
    if (kDebugMode) {
      print("Directing Navigation Path: route=$route, ID=$actionId");
    }
    // Application-specific global UI router hook would run here.
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:nulac/core/notifications/notification_service.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';
import 'package:nulac/features/products/presentation/bloc/product_bloc.dart';
import 'package:nulac/injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Bootstrap Firebase Core Services & FCM Listening Services
  try {
    await Firebase.initializeApp();
    await NotificationService().initialize();
  } catch (e) {
    // Graceful fallback for environments where Firebase credentials are sandbox mocked
    debugPrint("Firebase bootstrap halted: $e");
  }

  runApp(const NulacApp());
}

class NulacApp extends StatelessWidget {
  const NulacApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nulac Dairy',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRouter.splash,
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}

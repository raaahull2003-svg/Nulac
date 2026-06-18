import 'package:flutter/material.dart';
import 'package:nulac/features/home/presentation/screens/home_screen.dart';
import 'package:nulac/features/products/presentation/screens/products_screen.dart';
import 'package:nulac/features/products/presentation/screens/product_details_screen.dart';
import 'package:nulac/features/cart/presentation/screens/cart_screen.dart';
import 'package:nulac/features/checkout/presentation/screens/checkout_screen.dart';
import 'package:nulac/features/profile/presentation/screens/profile_screen.dart';
import 'package:nulac/features/subscription/presentation/screens/subscription_screen.dart';
import 'package:nulac/features/products/domain/entities/product.dart';

class AppRouter {
  static const String splash = '/';
  static const String home = '/home';
  static const String products = '/products';
  static const String productDetails = '/product_details';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String profile = '/profile';
  static const String subscription = '/subscription';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreenView());
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case products:
        return MaterialPageRoute(builder: (_) => const ProductsScreen());
      case productDetails:
        final product = settings.arguments as Product;
        return MaterialPageRoute(builder: (_) => ProductDetailsScreen(product: product));
      case cart:
        return MaterialPageRoute(builder: (_) => const CartScreen());
      case checkout:
        return MaterialPageRoute(builder: (_) => const CheckoutScreen());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case subscription:
        return MaterialPageRoute(builder: (_) => const SubscriptionScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for \${settings.name}'),
            ),
          ),
        );
    }
  }
}

class SplashScreenView extends StatelessWidget {
  const SplashScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacementNamed(context, AppRouter.home);
    });

    return Scaffold(
      backgroundColor: const Color(0xFF1B4D3E),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.eco, size: 80, color: Colors.white),
            const SizedBox(height: 16),
            const Text(
              'Nulac Dairy',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Pure • Fresh • Farm Direct',
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

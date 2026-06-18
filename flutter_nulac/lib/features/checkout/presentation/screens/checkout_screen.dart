import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _addressController = TextEditingController(text: 'Penthouse B4, Shanti Villa, Sector 5\nBengaluru, KA - 560001');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Order Shipping')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('DELIVERY ADDRESS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 8),
            TextField(controller: _addressController, maxLines: 3, decoration: const InputDecoration(border: OutlineInputBorder())),
            const SizedBox(height: 20),
            const Text('DELIVERY WINDOW', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.flash_on, color: AppTheme.accentGreen),
              title: const Text('Early Morning Cold-Chain Slot'),
              subtitle: const Text('06:00 AM - 08:30 AM (Pure freshness)'),
              trailing: const Icon(Icons.check_circle, color: AppTheme.primaryGreen),
              tileColor: AppTheme.paleGreen,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: const Text('Milking Request Dispatched'),
                    content: const Text('Your pasture-sourced milk is scheduled for harvest tonight and will arrive cold-preserved tomorrow morning!'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(AppRouter.home, (route) => false),
                        child: const Text('Acknowledge'),
                      )
                    ],
                  ),
                );
              },
              child: const Text('Place Pure Farm Order'),
            )
          ],
        ),
      ),
    );
  }
}

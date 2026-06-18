import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockCartItems = [
      {'id': '1', 'name': 'Pure A2 Gir Cow Milk', 'price': 85.0, 'unit': '500 ml', 'qty': 2, 'image': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400'},
      {'id': '2', 'name': 'Bilona Ghee (Vedic Method)', 'price': 650.0, 'unit': '500 ml', 'qty': 1, 'image': 'https://images.unsplash.com/photo-1589733901241-5e514f26b43f?auto=format&fit=crop&q=80&w=400'}
    ];

    double subtotal = mockCartItems.fold(0, (sum, i) => sum + (i['price'] as double) * (i['qty'] as int));
    double deliveryFee = 0.0;
    double tax = subtotal * 0.05;
    double total = subtotal + deliveryFee + tax;

    return Scaffold(
      appBar: AppBar(title: const Text('Shopping Basket')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: mockCartItems.length,
              itemBuilder: (context, idx) {
                final item = mockCartItems[idx];
                return Card(
                  elevation: 0,
                  color: Colors.grey[50],
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.network(item['image'] as String, width: 50, height: 50, fit: BoxFit.cover)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(item['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1),
                            Text(item['unit'] as String, style: const TextStyle(color: Colors.grey, fontSize: 10)),
                            const SizedBox(height: 4),
                            Text('₹${item['price']}', style: const TextStyle(color: AppTheme.primaryGreen, fontWeight: FontWeight.bold))
                          ]),
                        ),
                        Text('QTY: ${item['qty']}', style: const TextStyle(fontWeight: FontWeight.bold))
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Colors.grey[200]!))),
            child: Column(
              children: [
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Subtotal'), Text('₹${subtotal}')]),
                const SizedBox(height: 6),
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Estimated GST (5%)'), Text('₹${tax.toStringAsFixed(1)}')]),
                const Divider(height: 20),
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold)), Text('₹${total.toStringAsFixed(1)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryGreen))]),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                  onPressed: () => Navigator.pushNamed(context, AppRouter.checkout),
                  child: const Text('Proceed to Checkout'),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}

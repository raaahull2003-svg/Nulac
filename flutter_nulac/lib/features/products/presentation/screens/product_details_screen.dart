import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/features/products/domain/entities/product.dart';
import 'package:nulac/core/routing/app_router.dart';

class ProductDetailsScreen extends StatefulWidget {
  final Product product;
  const ProductDetailsScreen({super.key, required this.product});

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                p.image,
                fit: BoxFit.cover,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.paleGreen,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          p.category.toUpperCase(),
                          style: const TextStyle(color: AppTheme.primaryGreen, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text('${p.rating} (${p.reviewsCount} reviews)', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(p.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  Text(p.unit, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Text('₹${p.price}', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.primaryGreen)),
                      const Spacer(),
                      Container(
                        decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(8)),
                        child: Row(
                          children: [
                            IconButton(icon: const Icon(Icons.remove, size: 16), onPressed: () => setState(() => _quantity = _quantity > 1 ? _quantity - 1 : 1)),
                            Text('$_quantity', style: const TextStyle(fontWeight: FontWeight.bold)),
                            IconButton(icon: const Icon(Icons.add, size: 16), onPressed: () => setState(() => _quantity++)),
                          ],
                        ),
                      )
                    ],
                  ),
                  const Divider(height: 32),
                  const Text('Product Purity Standard', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.primaryGreen)),
                  const SizedBox(height: 6),
                  Text(p.description, style: const TextStyle(fontSize: 13, color: Colors.black80, height: 1.4)),
                  const SizedBox(height: 16),
                  const Text('Certified Benefits', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: p.benefits.map((b) => Chip(label: Text(b, style: const TextStyle(fontSize: 11)), backgroundColor: AppTheme.paleGreen)).toList(),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.pushNamed(context, AppRouter.subscription),
                          child: const Text('Subscribe Daily'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Added $_quantity basket packs!'), backgroundColor: AppTheme.primaryGreen),
                            );
                          },
                          child: const Text('Add to Basket'),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}

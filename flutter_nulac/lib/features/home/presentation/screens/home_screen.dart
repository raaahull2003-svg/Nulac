import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NULAC'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () => Navigator.pushNamed(context, AppRouter.cart),
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Navigator.pushNamed(context, AppRouter.profile),
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildPromoSlider(),
            _buildMembershipSection(context),
            _buildProductCategories(context),
            _buildWhyChooseUs(),
          ],
        ),
      ),
    );
  }

  Widget _buildPromoSlider() {
    return Container(
      margin: const EdgeInsets.all(16),
      height: 150,
      decoration: BoxDecoration(
        color: AppTheme.primaryGreen,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Pure, Organic Pasture', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 6),
            Text('A2 Milk delivered in pristine sterile glass bottles directly.', style: TextStyle(color: Colors.white70, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildMembershipSection(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.amber[50],
        border: Border.all(color: AppTheme.goldAccent, width: 1.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.workspace_premium, color: AppTheme.goldAccent),
          const SizedBox(width: 12),
          const Expanded(child: Text('NULAC GOLD CLUB\nUnlock free morning shipping', style: TextStyle(fontSize: 12))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12), minimumSize: const Size(50, 30)),
            onPressed: () => Navigator.pushNamed(context, AppRouter.subscription),
            child: const Text('Join', style: TextStyle(fontSize: 11)),
          )
        ],
      ),
    );
  }

  Widget _buildProductCategories(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Farm Fresh Dairy', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          TextButton(onPressed: () => Navigator.pushNamed(context, AppRouter.products), child: const Text('View Catalog')),
        ],
      ),
    );
  }

  Widget _buildWhyChooseUs() {
    return Container(
      color: AppTheme.paleGreen,
      padding: const EdgeInsets.all(20),
      child: const Column(
        children: [
          Text('Nulac Standard of Quality', style: TextStyle(fontWeight: FontWeight.bold)),
          SizedBox(height: 12),
          Text('✓ pasture grazed cow feeding\n✓ hormone-free certified lab test\n✓ strict 4°C early morning courier fleet', style: TextStyle(fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }
}

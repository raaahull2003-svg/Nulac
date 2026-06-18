import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nulac Account')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const CircleAvatar(radius: 40, backgroundColor: AppTheme.paleGreen, child: Icon(Icons.person, size: 40, color: AppTheme.primaryGreen)),
            const SizedBox(height: 12),
            const Text('Rohan Kumar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const Text('premium.member@nulac.in', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: AppTheme.primaryGreen, borderRadius: BorderRadius.circular(12)),
              child: Row(
                children: [
                  const Icon(Icons.wallet, color: Colors.white),
                  const SizedBox(width: 12),
                  const Expanded(child: Text('Pre-Paid Wallet Balance', style: TextStyle(color: Colors.white))),
                  const Text('₹720.00', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18))
                ],
              ),
            ),
            const SizedBox(height: 20),
            _buildActionItem(Icons.playlist_add_check, 'My active subscriptions'),
            _buildActionItem(Icons.history, 'Order history'),
            _buildActionItem(Icons.chat_bubble_outline, 'Direct farm support'),
          ],
        ),
      ),
    );
  }

  Widget _buildActionItem(IconData icon, String label) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryGreen),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {},
    );
  }
}

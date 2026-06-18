import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';

class Subscription {
  final String id;
  final String productName;
  final String milkType; // 'Cow' or 'Buffalo'
  final String frequency; // 'Daily' or 'Alternate'
  final int quantity; // Liters
  final String timeSlot;
  bool isActive;
  final DateTime startDate;

  Subscription({
    required this.id,
    required this.productName,
    required this.milkType,
    required this.frequency,
    required this.quantity,
    required this.timeSlot,
    this.isActive = true,
    required this.startDate,
  });
}

class SubscriptionHistoryItem {
  final String productName;
  final String frequency;
  final int quantity;
  final String dateRange;
  final String status; // 'Completed' or 'Cancelled'

  SubscriptionHistoryItem({
    required this.productName,
    required this.frequency,
    required this.quantity,
    required this.dateRange,
    required this.status,
  });
}

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _StatefulCard extends StatelessWidget {
  final Widget child;
  const _StatefulCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _SubscriptionScreenState extends State<SubscriptionScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Active Subscriptions State
  final List<Subscription> _subscriptions = [
    Subscription(
      id: 'sub-cow-1',
      productName: 'A2 Desi Cow Milk (Pure Glass Bottle)',
      milkType: 'Cow',
      frequency: 'Daily',
      quantity: 2,
      timeSlot: 'Morning (5:00 AM - 7:30 AM)',
      isActive: true,
      startDate: DateTime(2026, 6, 1),
    ),
  ];

  // Subscription History State
  final List<SubscriptionHistoryItem> _history = [
    SubscriptionHistoryItem(
      productName: 'A2 Premium Buffalo Milk (Fresh Country Farm)',
      frequency: 'Alternate Days',
      quantity: 1,
      dateRange: 'April 10, 2026 - May 15, 2026',
      status: 'Completed',
    ),
  ];

  // Creation Form state
  String _selectedMilkType = 'Cow'; // 'Cow' or 'Buffalo'
  String _selectedFrequency = 'Daily'; // 'Daily' or 'Alternate'
  int _quantity = 1;
  String _selectedTimeSlot = 'Morning (5:00 AM - 7:30 AM)';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _addNewSubscription() {
    final String pName = _selectedMilkType == 'Cow' 
        ? 'A2 Desi Cow Milk (Pure Glass Bottle)' 
        : 'A2 Premium Buffalo Milk (Fresh Country Farm)';

    setState(() {
      _subscriptions.insert(
        0,
        Subscription(
          id: 'sub-new-${DateTime.now().millisecondsSinceEpoch}',
          productName: pName,
          milkType: _selectedMilkType,
          frequency: _selectedFrequency,
          quantity: _quantity,
          timeSlot: _selectedTimeSlot,
          isActive: true,
          startDate: DateTime.now(),
        ),
      );
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎉 $pName subscription established successfully!'),
        backgroundColor: AppTheme.primaryGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
    _tabController.animateTo(0); // Switch to Active lists and Calendar
  }

  // Calculate if a given day is scheduled for delivery
  bool _isDaySlatedForDelivery(DateTime date) {
    if (_subscriptions.isEmpty) return false;
    
    // Check if any active subscription covers this date
    for (var sub in _subscriptions) {
      if (!sub.isActive) continue;
      if (date.isBefore(sub.startDate)) continue;

      if (sub.frequency == 'Daily') {
        return true;
      } else if (sub.frequency == 'Alternate') {
        final daysDiff = date.difference(sub.startDate).inDays;
        if (daysDiff % 2 == 0) {
          return true;
        }
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: const Text(
          'Milk Subscriptions',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryGreen,
          unselectedLabelColor: Colors.grey,
          indicatorColor: AppTheme.primaryGreen,
          tabs: const [
            Tab(text: 'Active & Calendar'),
            Tab(text: 'Establish Routine'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // TAB 1: ACTIVE SUBS AND INTEGRATED CALENDAR
          _buildActiveAndCalendarTab(now),

          // TAB 2: ESTABLISH NEW ROUTINE FORM
          _buildEstablishRoutineTab(),
        ],
      ),
    );
  }

  Widget _buildActiveAndCalendarTab(DateTime now) {
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // Briefing Card
        _StatefulCard(
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primaryGreen.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.calendar_today, color: AppTheme.primaryGreen),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Pasture-to-Fridge Calendar',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Manage daily cold-chain deliveries, pause routines, and check upcoming shipments.',
                      style: TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // INTEGRATED SUBSCRIPTION CALENDAR
        const Text(
          'DELIVERY CALENDAR',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
        ),
        const SizedBox(height: 8),
        _buildCalendarWidget(now),

        const SizedBox(height: 16),

        // ACTIVE ROUTINES
        const Text(
          'ACTIVE ROUTINES',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
        ),
        const SizedBox(height: 8),
        
        if (_subscriptions.isEmpty)
          _StatefulCard(
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: 24.0),
              child: Column(
                children: [
                  Icon(Icons.no_meals, size: 36, color: Colors.grey),
                  SizedBox(height: 8),
                  Text('No active milk routines registered.', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('Swipe or tap tab to establish your first delivery cycle.', style: TextStyle(color: Colors.grey, fontSize: 11)),
                ],
              ),
            ),
          )
        else
          ..._subscriptions.map((sub) => _buildSubscriptionListTile(sub)),

        // UPCOMING SHIPMENTS LIST (Calculated on state)
        const SizedBox(height: 12),
        const Text(
          'UPCOMING DELIVERIES',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
        ),
        const SizedBox(height: 8),
        _buildUpcomingDeliveriesWidget(now),

        // HISTORIC RECORDS
        const SizedBox(height: 12),
        const Text(
          'SUBSCRIPTION HISTORY',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
        ),
        const SizedBox(height: 8),
        ..._history.map((h) => _buildHistoryItem(h)),
      ],
    );
  }

  Widget _buildCalendarWidget(DateTime now) {
    // We generate a list of days in the current month (e.g. June 2026)
    final year = now.year;
    final month = now.month;
    final totalDays = DateUtils.getDaysInMonth(year, month);
    final firstDayOfMonth = DateTime(year, month, 1);
    final weekdayOffset = firstDayOfMonth.weekday; // Monday = 1, Sunday = 7

    return _StatefulCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'June 2026',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(color: AppTheme.primaryGreen, shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 4),
                  const Text('Delivery Slated', style: TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              )
            ],
          ),
          const SizedBox(height: 16),
          // Day labels
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: const [
              Text('M', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('T', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('W', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('T', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('F', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('S', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
              Text('S', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: totalDays + (weekdayOffset - 1),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              childAspectRatio: 1,
            ),
            itemBuilder: (context, index) {
              final adjustedIndex = index - (weekdayOffset - 1);
              if (adjustedIndex < 0) {
                return const SizedBox.shrink();
              }

              final currentDay = adjustedIndex + 1;
              final dayDateTime = DateTime(year, month, currentDay);
              final isDelivery = _isDaySlatedForDelivery(dayDateTime);
              final isToday = currentDay == now.day && month == now.month && year == now.year;

              return Container(
                decoration: BoxDecoration(
                  color: isDelivery 
                      ? AppTheme.primaryGreen.withOpacity(0.1) 
                      : (isToday ? Colors.grey.shade100 : Colors.transparent),
                  shape: BoxShape.circle,
                  border: isToday 
                      ? Border.all(color: AppTheme.primaryGreen, width: 1.5) 
                      : null,
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$currentDay',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isToday || isDelivery ? FontWeight.bold : FontWeight.normal,
                          color: isDelivery ? AppTheme.primaryGreen : Colors.black87,
                        ),
                      ),
                      if (isDelivery)
                        Container(
                          margin: const EdgeInsets.only(top: 2),
                          width: 4,
                          height: 4,
                          decoration: const BoxDecoration(
                            color: AppTheme.primaryGreen,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSubscriptionListTile(Subscription sub) {
    return _StatefulCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: sub.milkType == 'Cow' ? Colors.amber.shade50 : Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Icon(
                    Icons.coffee,
                    color: sub.milkType == 'Cow' ? Colors.amber.shade800 : Colors.blue.shade800,
                    size: 20,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      sub.productName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87),
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, py: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            sub.frequency,
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${sub.quantity} Liters • ${sub.timeSlot.split(' ')[0]}',
                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: 24, thickness: 0.5),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Container(
                    width: 7,
                    height: 7,
                    decoration: BoxDecoration(
                      color: sub.isActive ? AppTheme.primaryGreen : Colors.amber.shade700,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    sub.isActive ? 'Active Delivery' : 'Paused',
                    style: TextStyle(
                      fontSize: 11, 
                      fontWeight: FontWeight.bold,
                      color: sub.isActive ? AppTheme.primaryGreen : Colors.amber.shade800,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  // Cancel Button
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _subscriptions.removeWhere((item) => item.id == sub.id);
                        _history.insert(
                          0,
                          SubscriptionHistoryItem(
                            productName: sub.productName,
                            frequency: sub.frequency,
                            quantity: sub.quantity,
                            dateRange: 'Started ${sub.startDate.day}/${sub.startDate.month}/${sub.startDate.year}',
                            status: 'Cancelled',
                          ),
                        );
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Subscription has been cancelled.')),
                      );
                    },
                    child: const Text('Cancel', style: TextStyle(color: Colors.red, fontSize: 11)),
                  ),
                  const SizedBox(width: 4),
                  // Pause / Resume Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: sub.isActive ? Colors.amber.shade50 : AppTheme.primaryGreen.withOpacity(0.1),
                      foregroundColor: sub.isActive ? Colors.amber.shade900 : AppTheme.primaryGreen,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {
                      setState(() {
                        sub.isActive = !sub.isActive;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(sub.isActive ? 'Subscription resumed!' : 'Subscription paused.'),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                    child: Text(
                      sub.isActive ? 'Pause' : 'Resume',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildUpcomingDeliveriesWidget(DateTime now) {
    // Generate next 4 calendar work elements starting tomorrow
    final List<Map<String, dynamic>> items = [];
    int counter = 1;
    while (items.length < 4 && counter < 15) {
      final dateCandidate = now.add(Duration(days: counter));
      if (_isDaySlatedForDelivery(dateCandidate)) {
        // Find which subscriptions are targeted
        for (var sub in _subscriptions) {
          if (!sub.isActive) continue;
          if (dateCandidate.isBefore(sub.startDate)) continue;

          bool fits = false;
          if (sub.frequency == 'Daily') {
            fits = true;
          } else if (sub.frequency == 'Alternate') {
            final daysDiff = dateCandidate.difference(sub.startDate).inDays;
            if (daysDiff % 2 == 0) {
              fits = true;
            }
          }

          if (fits) {
            items.add({
              'date': dateCandidate,
              'product': sub.productName,
              'quantity': sub.quantity,
              'time': sub.timeSlot,
              'type': sub.milkType,
            });
          }
        }
      }
      counter++;
    }

    if (items.isEmpty) {
      return _StatefulCard(
        child: const Padding(
          padding: EdgeInsets.symmetric(vertical: 12.0),
          child: Center(
            child: Text(
              'No upcoming deliveries scheduled.',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
        ),
      );
    }

    return _StatefulCard(
      child: Column(
        children: items.map((delivery) {
          final DateTime date = delivery['date'];
          final String weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.weekday - 1];
          final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          return Padding(
            padding: const EdgeInsets.only(bottom: 10.0),
            child: Row(
              children: [
                Container(
                  width: 38,
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.black.withOpacity(0.04)),
                  ),
                  child: Column(
                    children: [
                      Text(weekday, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                      Text('${date.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        delivery['product'],
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.black87),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        '${delivery['quantity']} Liter(s) • ${delivery['time']}',
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      )
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, py: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryGreen.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'Slated',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.primaryGreen),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildHistoryItem(SubscriptionHistoryItem h) {
    return _StatefulCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.history_toggle_off, color: Colors.grey, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  h.productName,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  '${h.quantity}L • ${h.frequency} • ${h.dateRange}',
                  style: const TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, py: 3),
            decoration: BoxDecoration(
              color: h.status == 'Cancelled' ? Colors.red.shade50 : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              h.status,
              style: TextStyle(
                fontSize: 9, 
                fontWeight: FontWeight.black, 
                color: h.status == 'Cancelled' ? Colors.red.shade700 : Colors.grey.shade600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEstablishRoutineTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Milk selector cows/buffalos
          const Text(
            'SELECT MILK TYPE',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedMilkType = 'Cow'),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _selectedMilkType == 'Cow' ? AppTheme.primaryGreen.withOpacity(0.08) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _selectedMilkType == 'Cow' ? AppTheme.primaryGreen : Colors.grey.shade200,
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.eco_outlined, 
                          color: _selectedMilkType == 'Cow' ? AppTheme.primaryGreen : Colors.grey,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        const Text('A2 Cow Milk', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 2),
                        const Text('Light & Nutritious', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedMilkType = 'Buffalo'),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _selectedMilkType == 'Buffalo' ? AppTheme.primaryGreen.withOpacity(0.08) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _selectedMilkType == 'Buffalo' ? AppTheme.primaryGreen : Colors.grey.shade200,
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.water_drop_outlined, 
                          color: _selectedMilkType == 'Buffalo' ? AppTheme.primaryGreen : Colors.grey,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        const Text('A2 Buffalo Milk', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 2),
                        const Text('Rich & Creamy', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Frequency chip selection
          const Text(
            'DELIVERY FREQUENCY',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: ChoiceChip(
                  label: const Center(child: Text('Deliver Every Day', style: TextStyle(fontWeight: FontWeight.bold))),
                  selected: _selectedFrequency == 'Daily',
                  selectedColor: AppTheme.primaryGreen.withOpacity(0.2),
                  checkmarkColor: AppTheme.primaryGreen,
                  onSelected: (_) => setState(() => _selectedFrequency = 'Daily'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ChoiceChip(
                  label: const Center(child: Text('Alternate Days', style: TextStyle(fontWeight: FontWeight.bold))),
                  selected: _selectedFrequency == 'Alternate',
                  selectedColor: AppTheme.primaryGreen.withOpacity(0.2),
                  checkmarkColor: AppTheme.primaryGreen,
                  onSelected: (_) => setState(() => _selectedFrequency = 'Alternate'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Quantity Selection
          const Text(
            'QUANTITY PER DELIVERY (IN LITERS)',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
          ),
          const SizedBox(height: 8),
          _StatefulCard(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('Daily Litre Volume', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline, color: Colors.grey),
                      onPressed: () {
                        if (_quantity > 1) {
                          setState(() => _quantity--);
                        }
                      },
                    ),
                    Text(
                      '$_quantity L',
                      style: const TextStyle(fontWeight: FontWeight.black, fontSize: 15),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline, color: AppTheme.primaryGreen),
                      onPressed: () {
                        if (_quantity < 10) {
                          setState(() => _quantity++);
                        }
                      },
                    ),
                  ],
                )
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Preferred Hour Time slot
          const Text(
            'PREFERRED TIMING SEGMENT',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
          ),
          const SizedBox(height: 8),
          _StatefulCard(
            child: Column(
              children: [
                RadioListTile<String>(
                  value: 'Morning (5:00 AM - 7:30 AM)',
                  groupValue: _selectedTimeSlot,
                  activeColor: AppTheme.primaryGreen,
                  title: const Text('Morning Cycle', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: const Text('Between 5:00 AM - 7:30 AM', style: TextStyle(fontSize: 11)),
                  onChanged: (val) => setState(() => _selectedTimeSlot = val!),
                ),
                const Divider(height: 1, thickness: 0.5),
                RadioListTile<String>(
                  value: 'Evening (5:30 PM - 8:00 PM)',
                  groupValue: _selectedTimeSlot,
                  activeColor: AppTheme.primaryGreen,
                  title: const Text('Evening Cycle', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: const Text('Between 5:30 PM - 8:00 PM', style: TextStyle(fontSize: 11)),
                  onChanged: (val) => setState(() => _selectedTimeSlot = val!),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryGreen,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: _addNewSubscription,
            child: const Text('Establish Routine Delivery', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

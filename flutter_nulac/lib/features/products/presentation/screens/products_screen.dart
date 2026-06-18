import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';
import 'package:nulac/features/products/domain/entities/product.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  String _selectedCategory = 'All';
  String _searchQuery = '';

  final List<Product> _products = const [
    Product(
      id: "1",
      name: "Pure A2 Gir Cow Milk",
      category: "milk",
      price: 85.0,
      originalPrice: 95.0,
      unit: "500 ml",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      reviewsCount: 342,
      description: "Directly sourced from pasture-grazed Gir cows known for digestible rich beta-casein proteins.",
      origin: "Nulac Farmlands, Coorg",
      benefits: ["Highly digestible", "Unprocessed", "Zero Additives"]
    ),
    Product(
      id: "2",
      name: "Bilona Ghee (Vedic Method)",
      category: "ghee",
      price: 650.0,
      originalPrice: 720.0,
      unit: "500 ml",
      image: "https://images.unsplash.com/photo-1589733901241-5e514f26b43f?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      reviewsCount: 215,
      description: "Churned slowly in earthenware using ancient Indian alignment standards to extract rich granules.",
      origin: "Vedic Farms, Coorg",
      benefits: ["Aromatic granules", "Builds immunity", "Keto friendly"]
    ),
    Product(
      id: "3",
      name: "Fresh Artisanal Paneer",
      category: "paneer",
      price: 180.0,
      unit: "200 g",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400",
      rating: 4.9,
      reviewsCount: 168,
      description: "Soft, hand-pressed block of artisanal organic cottage cheese structured with daily fresh grass milk.",
      origin: "Nulac Cooperative, Coorg",
      benefits: ["High protein source", "Mouth-melting texture", "Preservative-free"]
    ),
    Product(
      id: "4",
      name: "Creamy Probiotic Dahi",
      category: "dahi",
      price: 55.0,
      unit: "400 g",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
      rating: 4.8,
      reviewsCount: 194,
      description: "Thick and velvet probiotic curd set naturally with live beneficial cultures for superior gut microbiome health.",
      origin: "Coorg Micro-Dairy Facility",
      benefits: ["Active cultures", "Smooth and low acidic", "Calms digestion"]
    )
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _products.where((p) {
      final matchesCat = _selectedCategory == 'All' || p.category.toLowerCase() == _selectedCategory.toLowerCase();
      final matchesSearch = p.name.toLowerCase().contains(_searchQuery.toLowerCase()) || p.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pure Catalog'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () => Navigator.pushNamed(context, AppRouter.cart),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search pasture milk, ghee...',
                prefixIcon: const Icon(Icons.search, color: AppTheme.primaryGreen),
                filled: true,
                fillColor: Colors.grey[50],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          SizedBox(
            height: 48,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: ['All', 'Milk', 'Ghee', 'Paneer', 'Dahi'].map((cat) {
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedCategory = cat),
                    selectedColor: AppTheme.primaryGreen,
                    checkmarkColor: Colors.white,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppTheme.primaryGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: filtered.isEmpty
                ? const Center(child: Text('No certified organic dairy items found.'))
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.72,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                    ),
                    itemCount: filtered.length,
                    itemBuilder: (context, idx) {
                      final p = filtered[idx];
                      return _buildProductCard(context, p);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(BuildContext context, Product p) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRouter.productDetails, arguments: p),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.grey[200]!),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: Image.network(
                  p.image,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark),
                  ),
                  Text(
                    p.unit,
                    style: const TextStyle(color: Colors.grey, fontSize: 10),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        '₹${p.price}',
                        style: const TextStyle(color: AppTheme.primaryGreen, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppTheme.paleGreen,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.add, color: AppTheme.primaryGreen, size: 16),
                      ),
                    ],
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

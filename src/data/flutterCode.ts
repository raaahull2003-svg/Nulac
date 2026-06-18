import { FlutterFile, FolderNode } from '../types';

export const FLUTTER_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    content: `name: nulac
description: Nulac Premium Dairy Mobile Application (Pure • Fresh • Farm Direct)
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter

  # UI and Navigation
  cupertino_icons: ^1.0.5
  google_fonts: ^5.1.0
  flutter_svg: ^2.0.7
  carousel_slider: ^4.2.1
  motion_tab_bar: ^0.2.7
  shimmer: ^3.1.0

  # Clean Architecture & State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  get_it: ^7.6.0
  dartz: ^0.10.1

  # Network & Database
  http: ^1.1.0
  shared_preferences: ^2.2.1

  # Firebase Cloud Messaging & Push Notifications
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.10
  flutter_local_notifications: ^16.1.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true
  assets:
    - assets/images/logo.png
    - assets/images/milk_bottle.png
    - assets/images/ghee_jar.png
    - assets/images/dahi_cup.png
    - assets/images/paneer_pack.png
    - assets/images/home_banner.png
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
    debugPrint("Firebase bootstrap halted: \${e}");
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
`
  },
  {
    path: 'lib/core/theme/app_theme.dart',
    name: 'app_theme.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryGreen = Color(0xFF1B4D3E); // Deep Forest Green
  static const Color accentGreen = Color(0xFF2E8B57);  // Fresh Sea Green
  static const Color paleGreen = Color(0xFFE8F0EC);    // Soothing cream-green
  static const Color goldAccent = Color(0xFFD4AF37);   // Vedic Gold
  static const Color surfaceWhite = Color(0xFFFFFFFF); // Clean background
  static const Color textDark = Color(0xFF1C2826);     // Sophisticated Charcoal

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryGreen,
        primary: primaryGreen,
        secondary: accentGreen,
        tertiary: goldAccent,
        surface: surfaceWhite,
        onSurface: textDark,
      ),
      scaffoldBackgroundColor: surfaceWhite,
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.spaceGrotesk(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: primaryGreen,
          letterSpacing: -0.5,
        ),
        headlineMedium: GoogleFonts.spaceGrotesk(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: primaryGreen,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          color: textDark,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceWhite,
        elevation: 0,
        iconTheme: IconThemeData(color: primaryGreen),
        titleTextStyle: TextStyle(
          color: primaryGreen,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/core/routing/app_router.dart',
    name: 'app_router.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
    // Navigate to home after brief load
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
`
  },
  {
    path: 'lib/core/error/failures.dart',
    name: 'failures.dart',
    language: 'dart',
    content: `import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  const Failure([this.message = 'An unexpected error occurred']);

  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Server connection failed']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Cached data retrieval failed']);
}
`
  },
  {
    path: 'lib/features/products/domain/entities/product.dart',
    name: 'product.dart',
    language: 'dart',
    content: `import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String name;
  final String category;
  final double price;
  final double? originalPrice;
  final String unit;
  final String image;
  final double rating;
  final int reviewsCount;
  final String description;
  final String origin;
  final List<String> benefits;

  const Product({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    this.originalPrice,
    required this.unit,
    required this.image,
    required this.rating,
    required this.reviewsCount,
    required this.description,
    required this.origin,
    required this.benefits,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        category,
        price,
        originalPrice,
        unit,
        image,
        rating,
        reviewsCount,
        description,
        origin,
        benefits,
      ];
}
`
  },
  {
    path: 'lib/features/products/data/models/product_model.dart',
    name: 'product_model.dart',
    language: 'dart',
    content: `import 'package:nulac/features/products/domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
    required super.category,
    required super.price,
    super.originalPrice,
    required super.unit,
    required super.image,
    required super.rating,
    required super.reviewsCount,
    required super.description,
    required super.origin,
    required super.benefits,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      price: (json['price'] as num).toDouble(),
      originalPrice: json['originalPrice'] != null 
          ? (json['originalPrice'] as num).toDouble() 
          : null,
      unit: json['unit'] as String,
      image: json['image'] as String,
      rating: (json['rating'] as num).toDouble(),
      reviewsCount: json['reviewsCount'] as int,
      description: json['description'] as String,
      origin: json['origin'] as String,
      benefits: List<String>.from(json['benefits'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'price': price,
      'originalPrice': originalPrice,
      'unit': unit,
      'image': image,
      'rating': rating,
      'reviewsCount': reviewsCount,
      'description': description,
      'origin': origin,
      'benefits': benefits,
    };
  }
}
`
  },
  {
    path: 'lib/features/products/domain/repositories/product_repository.dart',
    name: 'product_repository.dart',
    language: 'dart',
    content: `import 'package:dartz/dartz.dart';
import 'package:nulac/core/error/failures.dart';
import 'package:nulac/features/products/domain/entities/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts();
  Future<Either<Failure, Product>> getProductById(String id);
}
`
  },
  {
    path: 'lib/features/products/domain/usecases/get_products_usecase.dart',
    name: 'get_products_usecase.dart',
    language: 'dart',
    content: `import 'package:dartz/dartz.dart';
import 'package:nulac/core/error/failures.dart';
import 'package:nulac/features/products/domain/entities/product.dart';
import 'package:nulac/features/products/domain/repositories/product_repository.dart';

class GetProductsUseCase {
  final ProductRepository repository;

  GetProductsUseCase(this.repository);

  Future<Either<Failure, List<Product>>> execute() async {
    return await repository.getProducts();
  }
}
`
  },
  {
    path: 'lib/features/products/presentation/bloc/product_bloc.dart',
    name: 'product_bloc.dart',
    language: 'dart',
    content: `import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:nulac/features/products/domain/entities/product.dart';
import 'package:nulac/features/products/domain/usecases/get_products_usecase.dart';

// Events
abstract class ProductEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadProductsEvent extends ProductEvent {}

// States
abstract class ProductState extends Equatable {
  @override
  List<Object?> get props => [];
}

class ProductInitial extends ProductState {}
class ProductLoading extends ProductState {}

class ProductLoaded extends ProductState {
  final List<Product> products;
  ProductLoaded(this.products);

  @override
  List<Object?> get props => [products];
}

class ProductError extends ProductState {
  final String message;
  ProductError(this.message);

  @override
  List<Object?> get props => [message];
}

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProductsUseCase getProductsUseCase;

  ProductBloc({required this.getProductsUseCase}) : super(ProductInitial()) {
    on<LoadProductsEvent>((event, emit) async {
      emit(ProductLoading());
      final result = await getProductsUseCase.execute();
      result.fold(
        (failure) => emit(ProductError(failure.message)),
        (products) => emit(ProductLoaded(products)),
      );
    });
  }
}
`
  },
  {
    path: 'lib/features/products/presentation/screens/products_screen.dart',
    name: 'products_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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

  // Static product list matching standard Nulac data model
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
          // Elegant search bar
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
          // Category chips
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
                        '₹\${p.price}',
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
`
  },
  {
    path: 'lib/features/products/presentation/screens/product_details_screen.dart',
    name: 'product_details_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
                          Text('\${p.rating} (\${p.reviewsCount} reviews)', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
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
                      Text('₹\${p.price}', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.primaryGreen)),
                      const Spacer(),
                      Container(
                        decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(8)),
                        child: Row(
                          children: [
                            IconButton(icon: const Icon(Icons.remove, size: 16), onPressed: () => setState(() => _quantity = _quantity > 1 ? _quantity - 1 : 1)),
                            Text('\$_quantity', style: const TextStyle(fontWeight: FontWeight.bold)),
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
                              SnackBar(content: Text('Added \$_quantity basket packs!'), backgroundColor: AppTheme.primaryGreen),
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
`
  },
  {
    path: 'lib/features/cart/presentation/screens/cart_screen.dart',
    name: 'cart_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
                            Text('₹\${item['price']}', style: const TextStyle(color: AppTheme.primaryGreen, fontWeight: FontWeight.bold))
                          ]),
                        ),
                        Text('QTY: \${item['qty']}', style: const TextStyle(fontWeight: FontWeight.bold))
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
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Subtotal'), Text('₹\${subtotal}')]),
                const SizedBox(height: 6),
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Estimated GST (5%)'), Text('₹\${tax.toStringAsFixed(1)}')]),
                const Divider(height: 20),
                Row(mainAxisAlignment: MainAxisAlignment.between, children: [const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold)), Text('₹\${total.toStringAsFixed(1)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryGreen))]),
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
`
  },
  {
    path: 'lib/features/checkout/presentation/screens/checkout_screen.dart',
    name: 'checkout_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:nulac/core/theme/app_theme.dart';
import 'package:nulac/core/routing/app_router.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _addressController = TextEditingController(text: 'Penthouse B4, Shanti Villa, Sector 5\\nBengaluru, KA - 560001');

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
`
  },
  {
    path: 'lib/features/profile/presentation/screens/profile_screen.dart',
    name: 'profile_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
`
  },
  {
    path: 'lib/features/subscription/presentation/screens/subscription_screen.dart',
    name: 'subscription_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
          id: 'sub-new-\${DateTime.now().millisecondsSinceEpoch}',
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
        content: Text('🎉 \$pName subscription established successfully!'),
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
                        '\$currentDay',
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
                          '\${sub.quantity} Liters • \${sub.timeSlot.split(\' \')[0]}',
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
                            dateRange: 'Started \${sub.startDate.day}/\${sub.startDate.month}/\${sub.startDate.year}',
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
                      Text('\${date.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
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
                        '\${delivery['quantity']} Liter(s) • \${delivery['time']}',
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
                  '\${h.quantity}L • \${h.frequency} • \${h.dateRange}',
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
                      '\$_quantity L',
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
`
  },
  {
    path: 'lib/features/home/presentation/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
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
          const Expanded(child: Text('NULAC GOLD CLUB\\nUnlock free morning shipping', style: TextStyle(fontSize: 12))),
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
          Text('✓ pasture grazed cow feeding\\n✓ hormone-free certified lab test\\n✓ strict 4°C early morning courier fleet', style: TextStyle(fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'android/build.gradle',
    name: 'build.gradle',
    language: 'yaml',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    ext.kotlin_version = '1.8.22'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.1'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
`
  },
  {
    path: 'android/app/build.gradle',
    name: 'build.gradle',
    language: 'yaml',
    content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

android {
    namespace "com.nulac.in"
    compileSdk 34

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "com.nulac.in"
        minSdk 21
        targetSdk 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName

        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

flutter {
    source '../..'
}

dependencies {}
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'yaml',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <application
        android:label="Nulac"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    path: 'ios/Podfile',
    name: 'Podfile',
    language: 'yaml',
    content: `platform :ios, '13.0'

# CocoaPods analytics are sent to a server. To disable, uncomment:
# disable_cocoapods_analytics!

flutter_ios_podfile_setup = File.join(File.dirname(__FILE__), 'Flutter', 'podhelper.rb')
require flutter_ios_podfile_setup

target 'Runner' do
  use_frameworks!
  use_modular_headers!

  flutter_install_all_ios_pods File.dirname(__FILE__)
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)', 'COCOAPODS=1']
    end
  end
end
`
  },
  {
    path: 'ios/Runner/Info.plist',
    name: 'Info.plist',
    language: 'yaml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>$(DEVELOPMENT_LANGUAGE)</string>
	<key>CFBundleDisplayName</key>
	<string>Nulac</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>nulac</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>$(FLUTTER_BUILD_NAME)</string>
	<key>CFBundleSignature</key>
	<string>????</string>
	<key>CFBundleVersion</key>
	<string>$(FLUTTER_BUILD_NUMBER)</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIMainStoryboardFile</key>
	<string>Main</string>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
	<key>UIViewControllerBasedStatusBarAppearance</key>
	<false/>
	<key>CADisableMinimumFrameDurationOnPhone</key>
	<true/>
	<key>UIApplicationSupportsIndirectInputEvents</key>
	<true/>
</dict>
</plist>
`
  },
  {
    path: 'fastlane/Fastfile',
    name: 'Fastfile',
    language: 'yaml',
    content: `default_platform(:android)

platform :android do
  desc "Submit a new Beta Build to Google Play Common Console Testing"
  lane :beta do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(
      track: "beta",
      aab: "../build/app/outputs/bundle/release/app-release.aab"
    )
  end

  desc "Build and sign the final release APK as production-ready candidate"
  lane :build_apk do
    gradle(
      task: "assembleRelease",
      properties: {
        "android.injected.signing.store.file" => "keystore.jks",
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"]
      }
    )
  end
end
`
  },
  {
    path: 'PLAY_STORE_RELEASE_GUIDE.md',
    name: 'PLAY_STORE_RELEASE_GUIDE.md',
    language: 'json',
    content: `# Play Store Release Playbook

This document details the configuration required to compile Nulac into a signed, Play Store-ready App Bundle (AAB) or standalone APK file.

## Prerequisites

1.  **JDK 17** installed and configured in your environment variable PATH.
2.  **Flutter SDK 3.x** or greater with Android Build Tools.

## Step 1: Keystore Generation

Generate your private security release key using the keytool utility:

\`\`\`bash
keytool -genkey -v -keystore android/app/keystore.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 \\
  -alias nulac_key
\`\`\`

## Step 2: Configure key credentials

Create a file named \`android/key.properties\` containing:

\`\`\`properties
storePassword=yourKeystorePassword
keyPassword=yourKeyPassword
keyAlias=nulac_key
storeFile=keystore.jks
\`\`\`

## Step 3: Fastlane deployment (Google Console APIs)

Use our preconfigured Fastlane scripts in \`fastlane/Fastfile\` to deploy:

\`\`\`bash
bundle exec fastlane android build_apk
\`\`\`
`
  },
  {
    path: 'lib/core/notifications/notification_service.dart',
    name: 'notification_service.dart',
    language: 'dart',
    content: `import 'dart:async';
import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotificationsPlugin = FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) return;

    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    await _fcm.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

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

    const AndroidNotificationChannel highPriorityChannel = AndroidNotificationChannel(
      'nulac_high_priority_alerts',
      'Nulac High Priority Notifications',
      description: 'Used for order delivery, express transactions, and launches.',
      importance: Importance.max,
      playSound: true,
    );

    await _localNotificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(highPriorityChannel);

    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;

      if (notification != null) {
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

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleNotificationRouting(message.data);
    });

    await _subscribeToDefaultChannels();
    _isInitialized = true;
  }

  Future<String?> getFCMToken() async {
    return await _fcm.getToken();
  }

  Future<void> _subscribeToDefaultChannels() async {
    await _fcm.subscribeToTopic('order_updates');
    await _fcm.subscribeToTopic('new_launches');
    await _fcm.subscribeToTopic('membership_offers');
    await _fcm.subscribeToTopic('delivery_updates');
  }

  void _onNotificationTapped(NotificationResponse response) {}

  void _handleNotificationRouting(Map<String, dynamic> data) {}
}
`
  }
];

export const FLUTTER_TREE_DATA: FolderNode = {
  name: 'nulac_app',
  path: '/',
  children: [
    {
      name: 'android',
      path: '/android',
      children: [
        {
          name: 'app',
          path: '/android/app',
          children: [
            {
              name: 'src',
              path: '/android/app/src',
              children: [
                {
                  name: 'main',
                  path: '/android/app/src/main',
                  children: [
                    { name: 'AndroidManifest.xml', path: '/android/app/src/main/AndroidManifest.xml', fileKey: 'android/app/src/main/AndroidManifest.xml' }
                  ]
                }
              ]
            },
            { name: 'build.gradle', path: '/android/app/build.gradle', fileKey: 'android/app/build.gradle' }
          ]
        },
        { name: 'build.gradle', path: '/android/build.gradle', fileKey: 'android/build.gradle' }
      ]
    },
    {
      name: 'ios',
      path: '/ios',
      children: [
        {
          name: 'Runner',
          path: '/ios/Runner',
          children: [
            { name: 'Info.plist', path: '/ios/Runner/Info.plist', fileKey: 'ios/Runner/Info.plist' }
          ]
        },
        { name: 'Podfile', path: '/ios/Podfile', fileKey: 'ios/Podfile' }
      ]
    },
    {
      name: 'lib',
      path: '/lib',
      children: [
        {
          name: 'core',
          path: '/lib/core',
          children: [
            {
              name: 'error',
              path: '/lib/core/error',
              children: [
                { name: 'failures.dart', path: '/lib/core/error/failures.dart', fileKey: 'lib/core/error/failures.dart' }
              ]
            },
            {
              name: 'routing',
              path: '/lib/core/routing',
              children: [
                { name: 'app_router.dart', path: '/lib/core/routing/app_router.dart', fileKey: 'lib/core/routing/app_router.dart' }
              ]
            },
            {
              name: 'theme',
              path: '/lib/core/theme',
              children: [
                { name: 'app_theme.dart', path: '/lib/core/theme/app_theme.dart', fileKey: 'lib/core/theme/app_theme.dart' }
              ]
            },
            {
              name: 'notifications',
              path: '/lib/core/notifications',
              children: [
                { name: 'notification_service.dart', path: '/lib/core/notifications/notification_service.dart', fileKey: 'lib/core/notifications/notification_service.dart' }
              ]
            }
          ]
        },
        {
          name: 'features',
          path: '/lib/features',
          children: [
            {
              name: 'home',
              path: '/lib/features/home',
              children: [
                {
                  name: 'presentation',
                  path: '/lib/features/home/presentation',
                  children: [
                    {
                      name: 'screens',
                      path: '/lib/features/home/presentation/screens',
                      children: [
                        { name: 'home_screen.dart', path: '/lib/features/home/presentation/screens/home_screen.dart', fileKey: 'lib/features/home/presentation/screens/home_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'products',
              path: '/lib/features/products',
              children: [
                {
                  name: 'data',
                  path: '/lib/features/products/data',
                  children: [
                    {
                      name: 'models',
                      path: '/lib/features/products/data/models',
                      children: [
                        { name: 'product_model.dart', path: '/lib/features/products/data/models/product_model.dart', fileKey: 'lib/features/products/data/models/product_model.dart' }
                      ]
                    }
                  ]
                },
                {
                  name: 'domain',
                  path: '/lib/features/products/domain',
                  children: [
                    {
                      name: 'entities',
                      path: '/lib/features/products/domain/entities',
                      children: [
                        { name: 'product.dart', path: '/lib/features/products/domain/entities/product.dart', fileKey: 'lib/features/products/domain/entities/product.dart' }
                      ]
                    },
                    {
                      name: 'repositories',
                      path: '/lib/features/products/domain/repositories',
                      children: [
                        { name: 'product_repository.dart', path: '/lib/features/products/domain/repositories/product_repository.dart', fileKey: 'lib/features/products/domain/repositories/product_repository.dart' }
                      ]
                    },
                    {
                      name: 'usecases',
                      path: '/lib/features/products/domain/usecases',
                      children: [
                        { name: 'get_products_usecase.dart', path: '/lib/features/products/domain/usecases/get_products_usecase.dart', fileKey: 'lib/features/products/domain/usecases/get_products_usecase.dart' }
                      ]
                    }
                  ]
                },
                {
                  name: 'presentation',
                  path: '/lib/features/products/presentation',
                  children: [
                    {
                      name: 'bloc',
                      path: '/lib/features/products/presentation/bloc',
                      children: [
                        { name: 'product_bloc.dart', path: '/lib/features/products/presentation/bloc/product_bloc.dart', fileKey: 'lib/features/products/presentation/bloc/product_bloc.dart' }
                      ]
                    },
                    {
                      name: 'screens',
                      path: '/lib/features/products/presentation/screens',
                      children: [
                        { name: 'products_screen.dart', path: '/lib/features/products/presentation/screens/products_screen.dart', fileKey: 'lib/features/products/presentation/screens/products_screen.dart' },
                        { name: 'product_details_screen.dart', path: '/lib/features/products/presentation/screens/product_details_screen.dart', fileKey: 'lib/features/products/presentation/screens/product_details_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'cart',
              path: '/lib/features/cart',
              children: [
                {
                  name: 'presentation',
                  path: '/lib/features/cart/presentation',
                  children: [
                    {
                      name: 'screens',
                      path: '/lib/features/cart/presentation/screens',
                      children: [
                        { name: 'cart_screen.dart', path: '/lib/features/cart/presentation/screens/cart_screen.dart', fileKey: 'lib/features/cart/presentation/screens/cart_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'checkout',
              path: '/lib/features/checkout',
              children: [
                {
                  name: 'presentation',
                  path: '/lib/features/checkout/presentation',
                  children: [
                    {
                      name: 'screens',
                      path: '/lib/features/checkout/presentation/screens',
                      children: [
                        { name: 'checkout_screen.dart', path: '/lib/features/checkout/presentation/screens/checkout_screen.dart', fileKey: 'lib/features/checkout/presentation/screens/checkout_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'profile',
              path: '/lib/features/profile',
              children: [
                {
                  name: 'presentation',
                  path: '/lib/features/profile/presentation',
                  children: [
                    {
                      name: 'screens',
                      path: '/lib/features/profile/presentation/screens',
                      children: [
                        { name: 'profile_screen.dart', path: '/lib/features/profile/presentation/screens/profile_screen.dart', fileKey: 'lib/features/profile/presentation/screens/profile_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'subscription',
              path: '/lib/features/subscription',
              children: [
                {
                  name: 'presentation',
                  path: '/lib/features/subscription/presentation',
                  children: [
                    {
                      name: 'screens',
                      path: '/lib/features/subscription/presentation/screens',
                      children: [
                        { name: 'subscription_screen.dart', path: '/lib/features/subscription/presentation/screens/subscription_screen.dart', fileKey: 'lib/features/subscription/presentation/screens/subscription_screen.dart' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { name: 'main.dart', path: '/lib/main.dart', fileKey: 'lib/main.dart' }
      ]
    },
    { name: 'pubspec.yaml', path: '/pubspec.yaml', fileKey: 'pubspec.yaml' },
    { name: 'fastlane', path: '/fastlane', children: [
        { name: 'Fastfile', path: '/fastlane/Fastfile', fileKey: 'fastlane/Fastfile' }
    ]},
    { name: 'PLAY_STORE_RELEASE_GUIDE.md', path: '/PLAY_STORE_RELEASE_GUIDE.md', fileKey: 'PLAY_STORE_RELEASE_GUIDE.md' }
  ]
};

import 'package:nulac/features/products/domain/entities/product.dart';

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

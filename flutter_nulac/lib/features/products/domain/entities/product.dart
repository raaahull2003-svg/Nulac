import 'package:equatable/equatable.dart';

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

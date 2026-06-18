import 'package:dartz/dartz.dart';
import 'package:nulac/core/error/failures.dart';
import 'package:nulac/features/products/domain/entities/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts();
  Future<Either<Failure, Product>> getProductById(String id);
}

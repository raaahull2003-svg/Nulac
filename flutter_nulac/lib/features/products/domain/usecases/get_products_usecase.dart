import 'package:dartz/dartz.dart';
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

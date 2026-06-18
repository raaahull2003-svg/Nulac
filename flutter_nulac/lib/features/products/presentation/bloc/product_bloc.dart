import 'package:flutter_bloc/flutter_bloc.dart';
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

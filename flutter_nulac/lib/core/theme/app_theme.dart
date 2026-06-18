import 'package:flutter/material.dart';
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

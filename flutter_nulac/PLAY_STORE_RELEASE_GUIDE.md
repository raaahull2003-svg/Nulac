# Play Store Release Playbook

This document details the configuration required to compile Nulac into a signed, Play Store-ready Android App Bundle (.aab) or standalone APK file.

## Configuration Details

*   **Application Name:** Nulac
*   **Package Name (Application ID):** `com.nulac.app`
*   **Target SDK:** 34
*   **Minimum SDK:** 21

---

## Step 1: Keystore Generation

Generate your private security release key using the standard Java `keytool` utility:

```bash
keytool -genkey -v -keystore android/app/keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias nulac_key
```

When prompted, enter a secure password and remember it for the next step.

---

## Step 2: Configure Key Credentials

Create a file named `android/key.properties` (already bootstrapped in the root of the android folder) containing:

```properties
storePassword=yourKeystorePassword
keyPassword=yourKeyPassword
keyAlias=nulac_key
storeFile=keystore.jks
```

*Note: Ensure `android/app/keystore.jks` is placed in the corresponding location or specify an absolute path.*

---

## Step 3: Compile and Build App Bundle (AAB)

To compile the Play Store-ready App Bundle, use standard Flutter compilation:

```bash
# Get dependencies
flutter pub get

# Build the signed release App Bundle (.aab)
flutter build appbundle --release
```

The resulting file will be located at:
`build/app/outputs/bundle/release/app-release.aab`

---

## Step 4: Fastlane Automation & Deployments

We provide preconfigured Fastlane tasks to automate both local building and store delivery using the Google Play Console Developer APIs:

### 1. Build signed Release APK
```bash
bundle exec fastlane android build_apk
```

### 2. Build signed Release App Bundle (.aab)
```bash
bundle exec fastlane android build_aab
```

### 3. Deploy to Beta Track
```bash
bundle exec fastlane android beta
```

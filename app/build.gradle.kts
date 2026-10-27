plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "es.jpadilso.paisanujabali"
    compileSdk = 34

    defaultConfig {
        applicationId = "es.jpadilso.paisanujabali"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    // Los audios .ogg ya van comprimidos; no los recomprimas.
    androidResources {
        noCompress += listOf("ogg", "png", "webp", "ttf")
    }
}

// Sin dependencias externas: solo WebView del sistema.

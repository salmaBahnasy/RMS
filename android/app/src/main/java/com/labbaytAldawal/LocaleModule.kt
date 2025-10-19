package com.aldawal.hrms

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LocaleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "LocaleModule"

  @ReactMethod
  fun setAppLocale(langTag: String) {
    val locales = LocaleListCompat.forLanguageTags(langTag) // "ar" أو "en-US"
    AppCompatDelegate.setApplicationLocales(locales)
  }
}

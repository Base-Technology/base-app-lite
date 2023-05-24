
gradlew assembleRelease

open-im-sdk-rn构建错误
android/build.gradle  末尾增加
configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.6.0'
            force 'androidx.core:core-ktx:1.6.0'
        }
        
    }
    one:
 pushy uploadApk android/app/build/outputs/apk/release/app-release.apk
two:
pushy bundle --platform android

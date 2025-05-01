package culinary.food_flow.data.remote

import culinary.food_flow.utils.TokenManager
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.net.ssl.TrustManager
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.*

object ApiClient {
    private const val BASE_URL = "https://10.0.2.2:7198/api/"

    private lateinit var tokenManager: TokenManager
    // private var onUnauthorized: (() -> Unit)? = null

    fun init(tokenManager: TokenManager) {
        this.tokenManager = tokenManager
        // this.onUnauthorized = onUnauthorized

        retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(getUnsafeOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    lateinit var retrofit: Retrofit
        private set

    private fun getUnsafeOkHttpClient(): OkHttpClient {
        val trustAllCerts = arrayOf<TrustManager>(
            object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            }
        )

        val sslContext = SSLContext.getInstance("SSL")
        sslContext.init(null, trustAllCerts, SecureRandom())
        val sslSocketFactory = sslContext.socketFactory

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        return OkHttpClient.Builder()
            .sslSocketFactory(sslSocketFactory, trustAllCerts[0] as X509TrustManager)
            .hostnameVerifier { _, _ -> true }
            .addInterceptor { chain ->
                val originalRequest = chain.request()
                val token = runBlocking { tokenManager.token.first() }

                val requestBuilder = originalRequest.newBuilder()
                token?.let {
                    requestBuilder.addHeader("Authorization", "Bearer $it")
                }
                val requestWithAuth = requestBuilder.build()

                val response = chain.proceed(requestWithAuth)

                if (response.code == 401) {
                    runBlocking {
                        tokenManager.clearToken()
                    }
                    // onUnauthorized?.invoke()
                }

                response
            }
            .addInterceptor(loggingInterceptor)
            .build()
    }
}



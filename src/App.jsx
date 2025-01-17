import React, { useState } from 'react';
    import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
    import jwtDecode from 'jwt-decode';
    import axios from 'axios';

    const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
    const DIGITZS_API_KEY = 'YOUR_DIGITZS_API_KEY';

    function App() {
      const [user, setUser] = useState(null);
      const [paymentData, setPaymentData] = useState(null);

      const handlePayment = async () => {
        try {
          const response = await axios.post(
            'https://api.digitzs.com/v1/payments',
            {
              amount: 1000,
              currency: 'USD',
              customer: {
                email: user.email,
                name: user.name
              }
            },
            {
              headers: {
                Authorization: `Bearer ${DIGITZS_API_KEY}`
              }
            }
          );
          setPaymentData(response.data);
        } catch (error) {
          console.error('Payment failed:', error);
        }
      };

      return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <div className="app">
            {!user ? (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  setUser(decoded);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            ) : (
              <div>
                <h1>Welcome, {user.name}</h1>
                <button onClick={handlePayment}>Make Payment</button>
                {paymentData && (
                  <div>
                    <h3>Payment Successful</h3>
                    <pre>{JSON.stringify(paymentData, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </GoogleOAuthProvider>
      );
    }

    export default App;

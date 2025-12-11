// App.jsx
import React, { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import useAuthUser from "./hooks/useAuthUser.js";

/* Simple route guards */
const RequireAuth = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RequireOnboarded = ({ children, authUser }) => {
  // If authUser exists and is not onboarded, redirect to onboarding.
  // When used alongside RequireAuth, authUser will be defined.
  if (authUser && !authUser.isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
};

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  // memoize derived booleans (optional)
  const isAuthenticated = useMemo(() => Boolean(authUser), [authUser]);
  const isOnboarded = useMemo(() => Boolean(authUser?.isOnboarded), [authUser?.isOnboarded]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Routes>
        {/* Landing / root */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : (
              <Navigate to={isOnboarded ? "/home" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/home" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/home" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {!isOnboarded ? <OnboardingPage /> : <Navigate to="/home" replace />}
            </RequireAuth>
          }
        />

        <Route
          path="/home"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <RequireOnboarded authUser={authUser}>
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              </RequireOnboarded>
            </RequireAuth>
          }
        />

        <Route
          path="/notifications"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <RequireOnboarded authUser={authUser}>
                <Layout showSidebar={true}>
                  <NotificationsPage />
                </Layout>
              </RequireOnboarded>
            </RequireAuth>
          }
        />

        <Route
          path="/call/:id"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <RequireOnboarded authUser={authUser}>
                {/* If you want the standard app chrome around CallPage, wrap with Layout */}
                <CallPage />
              </RequireOnboarded>
            </RequireAuth>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <RequireOnboarded authUser={authUser}>
                <Layout showSidebar={false}>
                  <ChatPage />
                </Layout>
              </RequireOnboarded>
            </RequireAuth>
          }
        />

        {/* fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (isOnboarded ? "/home" : "/onboarding") : "/"}
              replace
            />
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;

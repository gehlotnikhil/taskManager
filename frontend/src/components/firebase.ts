// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   signInWithPopup,
//   GoogleAuthProvider,
//   GithubAuthProvider,
//   fetchSignInMethodsForEmail,
//   linkWithCredential,
//   AuthProvider,
//   OAuthCredential,
// } from "firebase/auth";


// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyCJh40Y2lR4N1dxE2lPEw_HbA39V09l9gg",
//   authDomain: "codegalaxyproject.firebaseapp.com",
//   projectId: "codegalaxyproject",
//   storageBucket: "codegalaxyproject.firebasestorage.app",
//   messagingSenderId: "61985322403",
//   appId: "1:61985322403:web:07655ce53fadb94d829616",
//   measurementId: "G-YTX601QMEV",
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// // Initialize providers
// export const googleProvider = new GoogleAuthProvider();
// export const githubProvider = new GithubAuthProvider();

// // Helper function to get provider by ID
// export function getProvider(providerId: string): AuthProvider | null {
//   switch (providerId) {
//     case "google.com":
//       return googleProvider;
//     case "github.com":
//       return githubProvider;
//     case "password":
//       return null; // Handle email/password separately
//     default:
//       return null;
//   }
// }

// // Main sign-in function with account conflict detection
// export async function signInAndMerge(provider: AuthProvider) {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     return result;
//   } catch (error: any) {
//     if (error.code === "auth/account-exists-with-different-credential") {
//       const email = error.customData?.email;

//       if (!email) {
//         throw new Error("Unable to retrieve email from error");
//       }

//       console.log("⛔ Email already exists with different provider:", email);

//       // Get pending credential
//       const pendingCred =
//         GoogleAuthProvider.credentialFromError(error) ||
//         GithubAuthProvider.credentialFromError(error);

//       if (!pendingCred) {
//         throw new Error("Unable to extract credential");
//       }

//       // Fetch existing sign-in methods
//       const methods = await fetchSignInMethodsForEmail(auth, email);

//       if (!methods || methods.length === 0) {
//         throw new Error("No existing sign-in methods found");
//       }

//       const existingProviderId = methods[0];
//       console.log("Existing provider:", existingProviderId);

//       // Store pending credential for later use
//       storePendingCredential(pendingCred);

//       // Create custom error with provider info
//       const customError = new Error(
//         `Account exists with ${existingProviderId}`
//       ) as any;
//       customError.code = "auth/account-exists";
//       customError.existingProviderId = existingProviderId;
//       customError.email = email;
//       throw customError;
//     }

//     // Re-throw other errors
//     throw error;
//   }
// }

// // Store credential in session storage
// function storePendingCredential(credential: OAuthCredential) {
//   const credData = {
//     providerId: credential.providerId,
//     signInMethod: credential.signInMethod,
//     accessToken: (credential as any).accessToken,
//     idToken: (credential as any).idToken,
//   };
//   sessionStorage.setItem("pendingCred", JSON.stringify(credData));
// }

// // Retrieve and reconstruct credential from session storage
// function retrievePendingCredential(): OAuthCredential | null {
//   const storedCred = sessionStorage.getItem("pendingCred");
//   if (!storedCred) return null;

//   try {
//     const credData = JSON.parse(storedCred);

//     // Reconstruct credential based on provider
//     if (credData.providerId === "google.com") {
//       return GoogleAuthProvider.credential(
//         credData.idToken,
//         credData.accessToken
//       );
//     } else if (credData.providerId === "github.com") {
//       return GithubAuthProvider.credential(credData.accessToken);
//     }

//     return null;
//   } catch (error) {
//     console.error("Failed to parse stored credential:", error);
//     return null;
//   }
// }

// // Complete account linking (call this on user button click)
// export async function completeLinking(existingProvider: AuthProvider) {
//   try {
//     // Sign in with existing provider (popup triggered by user click)
//     const existingUserResult = await signInWithPopup(auth, existingProvider);

//     // Retrieve stored credential
//     const pendingCred = retrievePendingCredential();
//     if (!pendingCred) {
//       throw new Error("No pending credential found");
//     }

//     // Link accounts
//     await linkWithCredential(existingUserResult.user, pendingCred);

//     // Clean up
//     sessionStorage.removeItem("pendingCred");
//     console.log("✅ Providers Merged Successfully!");

//     return existingUserResult;
//   } catch (error: any) {
//     console.error("❌ Failed to link accounts:", error);
//     throw error;
//   }
// }

// // Clear pending credential
// export function clearPendingCredential() {
//   sessionStorage.removeItem("pendingCred");
// }

// // Check if there's a pending credential
// export function hasPendingCredential(): boolean {
//   return sessionStorage.getItem("pendingCred") !== null;
// }

// // Sign out
// export async function signOut() {
//   try {
//     await auth.signOut();
//     clearPendingCredential();
//     console.log("✅ Signed out successfully");
//   } catch (error) {
//     console.error("❌ Sign out failed:", error);
//     throw error;
//   }
// }
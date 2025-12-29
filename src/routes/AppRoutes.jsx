import RegistrarComponents from "@/pages/Registrar/index.jsx";
import RegistrarAssetsSection from "@/pages/Registrar/registrar-assets";
import AssetsApprovedDetailsPage from "@/pages/Registrar/registrar-assets/Assets-Approved/approved-details.jsx";
import AssetsDeniedDetailsPage from "@/pages/Registrar/registrar-assets/Assets-Denied/denied-details.jsx";
import AssetsMintedDetailsPage from "@/pages/Registrar/registrar-assets/Assets-Mint/minted-details.jsx";
import AssetsPendingReviewPage from "@/pages/Registrar/registrar-assets/Assets-Pending/pending-review.jsx";
import AssetsPublishedDetailsPage from "@/pages/Registrar/registrar-assets/Assets-Published/published-details.jsx";
import RegistrarDashboardSection from "@/pages/Registrar/registrar-dashboard";
import RegistrarIssuersSection from "@/pages/Registrar/registrar-issuers";
import IssuersDetails from "@/pages/Registrar/registrar-issuers/Details/issuers-details.jsx";
import RegistrarShareholdersSection from "@/pages/Registrar/registrar-shareholders";
import ShareholdersDetails from "@/pages/Registrar/registrar-shareholders/Details/shareholders-details.jsx";
import RegistrarTokenizationIssuanceQueueSection from "@/pages/Registrar/registrar-tokenization-issuance-queue/index.jsx";
import RegistrarTokenizationRequestsSection from "@/pages/Registrar/registrar-tokenization-requests";
import { Navigate, Route, Routes } from "react-router-dom";
import { USER_ROLES } from "../constants";
import AdminComponents from "../pages/Admin/index.jsx";
import ForgotPassword from "../pages/Auth/ForgotPassword.jsx";
import Login from "../pages/Auth/Login.jsx";
import SignUp from "../pages/Auth/Signup.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRedirect from "./RoleRedirect.jsx";
import RegistrarTokenizationPendingReviewPage from "@/pages/Registrar/registrar-tokenization-requests/Tokenization-Pending/pending-review";
import RegistrarTokenizationApprovedDetailsPage from "@/pages/Registrar/registrar-tokenization-requests/Tokenization-Approved/approved-details";
import IssuancePendingDetailsPage from "@/pages/Registrar/registrar-tokenization-issuance-queue/Issuance-Pending/issuance-pending-details";
import IssuanceIssuedDetailsPage from "@/pages/Registrar/registrar-tokenization-issuance-queue/Issuance-Issued/issuance-issued-detail";
import IssuerComponents from "@/pages/Issuer";
import IssuerDashboardSection from "@/pages/Issuer/issuer-dashboard";
import IssuerAssetsSection from "@/pages/Issuer/issuer-assets";
import CreateNewAsset from "@/pages/Issuer/issuer-assets/create";
import InvestorComponents from "@/pages/Investor";
import InvestorDashboardSection from "@/pages/Investor/investor-dashboard";
import InvestorDashboardDetail from "@/pages/Investor/investor-dashboard/dashboard-detail/investor-dashboard-detail";
import InvestorOpportunitiesSection from "@/pages/Investor/investor-opportunities";
import InvestorPortfolioSection from "@/pages/Investor/investor-portfolio";
import AdminDashboardSection from "@/pages/Admin/admin-dashboard";
import AdminInvestorsSection from "@/pages/Admin/admin-investors";
import AdminAssetsSection from "@/pages/Admin/admin-assets";
import KYCComponent from "@/pages/kyc";
import IssuerAssetsMintedDetailsPage from "@/pages/Issuer/issuer-assets/minted-detail/issuer-minted-details";
import IssuerAssetsReviewDetailsPage from "@/pages/Issuer/issuer-assets/review-detail/issuer-review-details";
import PendingApprovalDetailsPage from "@/pages/Registrar/registrar-tokenization-issuance-queue/pending-approval/pending-approval-details";
import IssuerPurchaseSection from "@/pages/Issuer/issuer-purchase";
import IssuancePendingDetails from "@/pages/Issuer/issuer-purchase/issuence-pending-details/issuer-pending-detail";
import IssuerAssetsPublishDetailsPage from "@/pages/Issuer/issuer-assets/publish-detail/issuer-publish-details";
import AdminAssetsPendingReviewPage from "@/pages/Admin/admin-assets/Assets-Pending/pending-review";
import AdminAssetsMintedDetailsPage from "@/pages/Admin/admin-assets/Assets-Mint/minted-details";
import AdminAssetsApprovedDetailsPage from "@/pages/Admin/admin-assets/Assets-Approved/approved-details";
import AdminAssetsDeniedDetailsPage from "@/pages/Admin/admin-assets/Assets-Denied/denied-details";
import AdminAssetsPublishedDetailsPage from "@/pages/Admin/admin-assets/Assets-Published/published-details";
import InvestorWalletSection from "@/pages/Investor/investor-wallet";
import InvestorSavedSection from "@/pages/Investor/investor-saved";
import IssuerAssetsDeniedDetailsPage from "@/pages/Issuer/issuer-assets/denied-detail/denied-details";
import AssetHolderSectionPage from "@/pages/Issuer/asset-holder";
import IssuerListingSectionPage from "@/pages/Issuer/issuer-listing";
import AdminIssuerSectionPage from "@/pages/Admin/admin-issuers";
import AdminPurchaseSectionPage from "@/pages/Admin/admin-purchase";
import IssuerRegistrarSectionPage from "@/pages/Admin/issuer-registrar";
import InvestorWalletSectionPage from "@/pages/Investor/investor-wallet";
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="/verify-kyc" element={<KYCComponent />} />
    </Route>


    //admin routes  
    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="/admin" element={<AdminComponents />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardSection />} />
        <Route path="investors" element={<AdminInvestorsSection />} />
        <Route path="issuers" element={<AdminIssuerSectionPage />} />
        <Route path="purchase-request" element={<AdminPurchaseSectionPage />} />
       <Route path="assets" element={<AdminAssetsSection />} />
        <Route
          path="assets/pending-review/:id"
          element={<AdminAssetsPendingReviewPage />}
        />
        <Route
          path="assets/minted-details/:id"
          element={<AdminAssetsMintedDetailsPage />}
        />
        <Route
          path="assets/approved-details/:id"
          element={<AdminAssetsApprovedDetailsPage />}
        />
        <Route
          path="assets/denied-details/:id"
          element={<AdminAssetsDeniedDetailsPage />}
        />
        <Route
          path="assets/published-details/:id"
          element={<AdminAssetsPublishedDetailsPage />}
        />
        <Route path="registrar" element={<IssuerRegistrarSectionPage />} />
      </Route>
    </Route>
    
    //investor routes
    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.INVESTOR]} />}>
      <Route
        path="/investor-dashboard"
        element={<Navigate to="/investor/dashboard" replace />}
      />
      <Route path="/investor" element={<InvestorComponents />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InvestorDashboardSection />} />
        <Route
          path="dashboard/detail/:id"
          element={<InvestorDashboardDetail />}
        />
        <Route
          path="opportunities"
          element={<InvestorOpportunitiesSection />}
        />
        <Route path="portfolio" element={<InvestorPortfolioSection />} />
        <Route path="wallet" element={<InvestorWalletSectionPage />} />
        <Route path="saved" element={<InvestorSavedSection />} />
      </Route>
    </Route>

    //issuer routes
    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ISSUER]} />}>
      <Route
        path="/issuer-dashboard"
        element={<Navigate to="/issuer/dashboard" replace />}
      />
      <Route path="/issuer" element={<IssuerComponents />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<IssuerDashboardSection />} />
        <Route path="assets" element={<IssuerAssetsSection />} />
        <Route path="assets/create" element={<CreateNewAsset />} />
        <Route path="assets/denied-details/:id" element={<IssuerAssetsDeniedDetailsPage />} />
        <Route path="assets/minted-details/:id" element={<IssuerAssetsMintedDetailsPage />} />
        <Route path="assets/review-details/:id" element={<IssuerAssetsReviewDetailsPage />} />
        <Route path="assets/publish-details/:id" element={<IssuerAssetsPublishDetailsPage />} />
        <Route path="purchase-requests" element={<IssuerPurchaseSection />} />
        <Route path="purchase-requests/pending-details/:id" element={<IssuancePendingDetails />} />
        <Route path="listing" element={<IssuerListingSectionPage />} />
        <Route path="asset-holders" element={<AssetHolderSectionPage />} />
      </Route>
    </Route>

    //registrar routes
    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]} />}>
      <Route
        path="/registrar-dashboard"
        element={<Navigate to="/registrar/dashboard" replace />}
      />
      <Route path="/registrar" element={<RegistrarComponents />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RegistrarDashboardSection />} />
        //tokenization requests routes
        <Route
          path="tokenization-requests"
          element={<RegistrarTokenizationRequestsSection />}
        />
        <Route
          path="tokenization-requests/pending-review/:id"
          element={<RegistrarTokenizationPendingReviewPage />}
        />
        <Route
          path="tokenization-requests/minted-details/:id"
          element={<RegistrarTokenizationApprovedDetailsPage />}
        />
       
        //assets routes
        <Route path="assets" element={<RegistrarAssetsSection />} />
        <Route
          path="assets/pending-review/:id"
          element={<AssetsPendingReviewPage />}
        />
        <Route
          path="assets/minted-details/:id"
          element={<AssetsMintedDetailsPage />}
        />
        <Route
          path="assets/approved-details/:id"
          element={<AssetsApprovedDetailsPage />}
        />
        <Route
          path="assets/denied-details/:id"
          element={<AssetsDeniedDetailsPage />}
        />
        <Route
          path="assets/published-details/:id"
          element={<AssetsPublishedDetailsPage />}
        />
        //tokenization issuance queue routes
        <Route
          path="tokenization-issuance-queue"
          element={<RegistrarTokenizationIssuanceQueueSection />}
        />
        <Route
          path="tokenization-issuance-queue/pending-details/:id"
          element={<IssuancePendingDetailsPage />}
        />
        <Route
          path="tokenization-issuance-queue/issued-details/:id"
          element={<IssuanceIssuedDetailsPage />}
        />
        <Route
          path="tokenization-issuance-queue/pending-approval-details/:id"
          element={<PendingApprovalDetailsPage />}
        />
        //issuers routes
        <Route path="issuers" element={<RegistrarIssuersSection />} />
        <Route path="issuers/details/:id" element={<IssuersDetails />} />
        //shareholders routes
        <Route path="shareholders" element={<RegistrarShareholdersSection />} />
        <Route
          path="shareholders/details/:id"
          element={<ShareholdersDetails />}
        />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;

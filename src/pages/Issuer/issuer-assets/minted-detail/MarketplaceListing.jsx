import {
  FaPlus,
  FaMinus,
  FaArrowUpFromBracket,
  FaXmark,
  FaCheck,
  FaPlus as FaPlusIcon,
} from "react-icons/fa6";
import Button from "@/components/shared/button";
import { DescriptionInput } from "@/components/shared";
import AssetsInput from "../create/fields/AssetsInput";
import logoIcon from "@/assets/issuer-assets/imglogo.svg";
import cardBackIcon from "@/assets/issuer-assets/cardback.svg";
import picIcon from "@/assets/issuer-assets/pic.svg";

function MarketplaceListing({
  isMarketplaceExpanded,
  setIsMarketplaceExpanded,
  marketplaceListingDescription,
  setMarketplaceListingDescription,
  marketplaceListingTeaser,
  setMarketplaceListingTeaser,
  globalAudienceSize,
  setGlobalAudienceSize,
  socialMediaPresence,
  setSocialMediaPresence,
  occupancyRate,
  setOccupancyRate,
  annualAttendance,
  setAnnualAttendance,
  marketplaceValidationErrors,
  isSubmittingMarketplace,
  handleSubmitMarketplaceListing,
  marketplaceSubmittedSuccessfully,
  marketplaceFieldsModified,
  logoRef,
  featureImageRef,
  additionalPhotosRef,
  additionalDocumentsRef,
  logoFile,
  featureImageFile,
  additionalPhotos,
  additionalDocuments,
  uploadingLogo,
  uploadingFeatureImage,
  uploadingPhoto,
  uploadingDocument,
  handleLogoUpload,
  handleFeatureImageUpload,
  handleAdditionalPhotosUpload,
  handleAdditionalDocumentsUpload,
  handleLogoClick,
  handleFeatureImageClick,
  handleAdditionalPhotosClick,
  handleAdditionalDocumentsClick,
  handleRemovePhoto,
  handleRemoveDocument,
  formatFileSize,
  sponsors,
  sponsorLogoRefs,
  uploadingLogoId,
  deletingSponsorId,
  sponsorValidationErrors,
  handleAddSponsor,
  handleRemoveSponsor,
  handleSponsorLogoClick,
  handleSponsorLogoUpload,
  handleSponsorFieldUpdate,
  handleSaveSponsor,
  savingSponsorId,
  sponsorsSavedSuccessfully,
  sponsorsFieldsModified,
  handlePublishToMarketplace,
  canPublishToMarketplace,
}) {
  return (
    <div className="border-b border-[#E5E5EA]">
      <button
        onClick={() => setIsMarketplaceExpanded(!isMarketplaceExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-start !text-[#000] font-semibold !text-[17px] !py-0">
            Marketplace Listing
          </span>
          <span className="text-start !text-[#48484A] font-normal !text-sm !py-0 mt-1">
            Add content to attract investors (stored off-chain, editable).
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isMarketplaceExpanded ? (
            <FaMinus className="w-4 h-4 text-[#000] cursor-pointer" />
          ) : (
            <FaPlus className="w-4 h-4 text-[#000] cursor-pointer" />
          )}
        </div>
      </button>

      {/* Section Content */}
      {isMarketplaceExpanded && (
        <div className="">
          <div className="p-5 space-y-6">
            {/* Marketplace Description */}
            <DescriptionInput
              name="description"
              value={marketplaceListingDescription}
              onChange={(e) => setMarketplaceListingDescription(e.target.value)}
              label="Marketplace Description"
              maxLength={500}
              rows={4}
              required={true}
              error={marketplaceValidationErrors.description}
              hint="This is the public-facing description. Your on-chain description remains unchanged and can be different."
            />
            <DescriptionInput
              name="marketplaceTeaser"
              value={marketplaceListingTeaser}
              onChange={(e) => setMarketplaceListingTeaser(e.target.value)}
              label="Marketplace Teaser"
              maxLength={220}
              rows={4}
              required={true}
              error={marketplaceValidationErrors.marketplaceTeaser}
              hint="Short summary displayed on opportunity cards"
            />

            {/* Scale Section */}
            <div className="space-y-6 border-t py-6 border-[#E5E5EA]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-[17px] font-semibold text-[#000]">
                    Scale
                  </h3>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  <div>
                    <AssetsInput
                      type="text"
                      name="globalAudienceSize"
                      value={globalAudienceSize}
                      onChange={(e) => setGlobalAudienceSize(e.target.value)}
                      label="Global Audience Size"
                      maxLength={20}
                      error={marketplaceValidationErrors.globalAudienceSize}
                      showCharCount={!!globalAudienceSize}
                      minLength={1}
                      required={true}
                      placeholder="Global Audience Size"
                      inputType="number"
                    />
                  </div>
                  <div>
                    <AssetsInput
                      type="text"
                      name="socialMediaPresence"
                      value={socialMediaPresence}
                      onChange={(e) => setSocialMediaPresence(e.target.value)}
                      label="Social Media Presence"
                      maxLength={20}
                      error={marketplaceValidationErrors.socialMediaPresence}
                      showCharCount={!!socialMediaPresence}
                      minLength={1}
                      required={true}
                      placeholder="Social Media Presence"
                      inputType="number"
                      suffix="Connections"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Utilization Section */}
            <div className=" space-y-6 py-6 border-t border-[#E5E5EA]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-[17px] font-semibold text-[#000]">
                    Stadium Utilization
                  </h3>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  <div>
                    <AssetsInput
                      name="occupancyRate"
                      value={occupancyRate}
                      onChange={(e) => setOccupancyRate(e.target.value)}
                      label="Occupancy Rate"
                      maxLength={20}
                      error={marketplaceValidationErrors.occupancyRate}
                      showCharCount={!!occupancyRate}
                      minLength={1}
                      required={true}
                      placeholder="Occupancy Rate %"
                      inputType="number"
                      suffix="%"
                      
                    />
                  </div>
                  <div>
                    <AssetsInput
                      name="annualAttendance"
                      value={annualAttendance}
                      onChange={(e) => setAnnualAttendance(e.target.value)}
                      label="Annual Attendance"
                      maxLength={20}
                      error={marketplaceValidationErrors.annualAttendance}
                      showCharCount={!!annualAttendance}
                      minLength={1}
                      required={true}
                      placeholder="Annual Attendance"
                      inputType="number"
                      suffix="Attendees"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-[320px]"
                  onClick={handleSubmitMarketplaceListing}
                  disabled={
                    isSubmittingMarketplace ||
                    Object.values(marketplaceValidationErrors).some(
                      (error) => error
                    ) ||
                    (marketplaceSubmittedSuccessfully && !marketplaceFieldsModified)
                  }
                >
                  {isSubmittingMarketplace
                    ? "Submitting..."
                    : "Submit Marketplace Listing"}
                </Button>
              </div>
            </div>
          </div>

          {/* Logo, Photos and Media Section */}
          <div className="p-5 space-y-6 border-t border-[#E5E5EA]">
            <div className="space-y-2">
              <h3 className="text-[17px] font-semibold text-[#000]">
                Logo, Photos and Media
              </h3>
              <p className="text-[13px] font-normal text-[#000]">
                Upload imagery to highlight your listing in the marketplace to
                potential Investors.
              </p>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={logoRef}
              type="file"
              accept=".png"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <input
              ref={featureImageRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFeatureImageUpload}
              className="hidden"
            />
            <input
              ref={additionalPhotosRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleAdditionalPhotosUpload}
              className="hidden"
            />
            <input
              ref={additionalDocumentsRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleAdditionalDocumentsUpload}
              className="hidden"
            />

            {/* Logo and Feature Image */}
            <div className="flex justify-between items-start gap-6 w-full">
              {/* Logo Upload */}
              <div className="flex flex-col items-center justify-center gap-3 flex-1 rounded-[15px] p-2 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                {logoFile?.preview ? (
                  <div className="flex flex-col items-center gap-3 w-full h-full">
                    <div className="relative w-[350px] h-[180px] flex items-center justify-center">
                      {uploadingLogo ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0734A9]"></div>
                          <p className="text-[13px] text-[#48484A]">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <img
                          src={logoFile.preview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <button
                      onClick={handleLogoClick}
                      disabled={uploadingLogo}
                      className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowUpFromBracket />
                      Replace Logo
                    </button>
                    <p className="text-[#000] text-center text-[11px] font-normal">
                      Recommended: vector or high-quality image. Accepted
                      formats: PNG. Max 5 MB
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-white bg-white/50">
                      <img
                        src={logoIcon}
                        alt="Logo"
                        className="w-5 h-5 object-cover"
                      />
                    </div>
                    <p className="text-[#000] text-[17px] font-semibold">
                      Logo
                    </p>
                    <p className="text-[#000] text-center text-[13px] font-normal">
                      Upload all white version of your logo file. It will be
                      placed on top of your feature image.
                    </p>
                    <button
                      onClick={handleLogoClick}
                      disabled={uploadingLogo}
                      className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowUpFromBracket />
                      {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    </button>
                    <p className="text-[#000] text-center text-[11px] font-normal">
                      Recommended: vector or high-quality image. Accepted
                      formats: PDF, PNG. Max 5 MB
                    </p>
                  </>
                )}
              </div>

              {/* Feature Image Upload */}
              <div className="flex flex-col items-center justify-center gap-3 flex-1 rounded-[15px] p-2 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                {featureImageFile?.preview ? (
                  <div className="flex flex-col items-center gap-3 w-full h-full">
                    <div className="relative w-[350px] h-[180px] flex items-center justify-center">
                      {uploadingFeatureImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0734A9]"></div>
                          <p className="text-[13px] text-[#48484A]">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <img
                          src={featureImageFile.preview}
                          alt="Feature image preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <button
                      onClick={handleFeatureImageClick}
                      disabled={uploadingFeatureImage}
                      className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowUpFromBracket />
                      Replace Feature Image
                    </button>
                    <p className="text-[#000] text-center text-[11px] font-normal ">
                      Recommended: high-quality image. Accepted formats: JPG,
                      PNG. Max 5 MB each.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-white bg-white/50">
                      <img
                        src={cardBackIcon}
                        alt="Feature Image"
                        className="w-5 h-5 object-cover"
                      />
                    </div>
                    <p className="text-[#000] text-[17px] font-semibold">
                      Feature Image
                    </p>
                    <p className="text-[#000] text-center text-[13px] font-normal">
                      Upload a featured image to highlight your listing in the
                      marketplace to potential Investors.
                    </p>
                    <button
                      onClick={handleFeatureImageClick}
                      disabled={uploadingFeatureImage}
                      className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowUpFromBracket />
                      {uploadingFeatureImage
                        ? "Uploading..."
                        : "Upload Feature Image"}
                    </button>
                    <p className="text-[#000] text-center text-[11px] font-normal pb-[18px]">
                      Recommended: high-quality image. Accepted formats: JPG,
                      PNG. Max 5 MB each.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Photos / Media */}
            <div className="space-y-4">
              {additionalPhotos.length === 0 ? (
                /* Initial State - Card Style */
                <div className="flex flex-col items-center justify-center gap-3 rounded-[15px] p-4 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]">
                  <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 ">
                    <img
                      src={picIcon}
                      alt="Additional Photos"
                      className="w-5 h-5 object-cover"
                    />
                  </div>
                  <p className="text-[#000] text-[17px] font-semibold">
                    Additional Photos / Media (max: 9)
                  </p>
                  <p className="text-[#000] text-center text-[13px] font-normal">
                    Upload images to highlight your listing in the marketplace
                    to potential Investors.
                  </p>
                  <button
                    onClick={handleAdditionalPhotosClick}
                    disabled={uploadingPhoto}
                    className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowUpFromBracket />
                    {uploadingPhoto
                      ? "Uploading..."
                      : "Upload Supporting Images"}
                  </button>
                  <p className="text-[#000] text-center text-[11px] font-normal">
                    Recommended: up to 9 high-quality images. Accepted formats:
                    JPG, PNG. Max 5 MB each.
                  </p>
                </div>
              ) : (
                /* Photos Grid - When photos exist */
                <>
                  <div className="flex flex-col gap-1">
                    <p className="text-[17px] font-semibold text-[#000]">
                      Additional Photos / Media (max: 9)
                    </p>
                    <p className="text-[13px] font-normal text-[#000]">
                      Upload images to highlight your listing in the marketplace
                      to potential Investors.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full">
                    {additionalPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative w-[231px] h-[131px] overflow-hidden group"
                      >
                        <img
                          src={photo.preview}
                          alt="Additional photo"
                          className="w-[231px] h-[131px]  overflow-y-auto scrollbar-hide  object-contain bg-white "
                        />
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaXmark className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {additionalPhotos.length < 9 && (
                      <button
                        onClick={handleAdditionalPhotosClick}
                        className="w-[231px] h-[131px] rounded-lg border-2 border-dashed border-[#E5E5EA] flex flex-col items-center justify-center gap-2 hover:border-[#0734A9] transition-colors bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]"
                      >
                        <FaArrowUpFromBracket className="w-6 h-6 text-[#0734A9]" />
                        <span className="text-[13px] font-semibold text-[#0734A9]">
                          Upload Image
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] font-normal text-[#48484A]">
                    Recommended: up to 9 high-quality images. Accepted formats:
                    JPG, PNG. Max 5 MB each.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Additional Documents Section */}
          <div className="p-5 space-y-6 border-t border-[#E5E5EA]">
            <div className="flex items-center justify-between w-full ">
              <div>
                <h3 className="text-[17px] font-semibold text-[#000]">
                  Additional Documents
                </h3>
                <p className="text-[13px] font-normal text-[#000] ">
                  Upload any additional marketing materials you would like to
                  display to investors. They will be able to review the
                  documentation submitted as part of the initial asset
                  tokenization request.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 w-[50%]">
              <Button
                        type="button"
                        variant="upload"
                        onClick={handleAdditionalDocumentsClick}
                        className="!rounded-full text-sm !px-2 py-1.5"
                        icon={<FaPlus />}
                        iconPosition="left"
                        disabled={
                          additionalDocuments.length >= 4 || uploadingDocument
                        }
                        loading={uploadingDocument}
                      >
                        Add Document
                      </Button>
                {/* <Button
                  onClick={handleAdditionalDocumentsClick}
                  variant="secondary"
                  size="sm"
                  disabled={
                    additionalDocuments.length >= 4 || uploadingDocument
                  }
                  icon={<FaPlusIcon />}
                  iconPosition="left"
                  className=""
                >
                  {uploadingDocument ? "Uploading..." : "Add Document"}
                </Button> */}
                <span className="text-xs text-[#AEAEB2]">Max: 4 documents</span>
              </div>
            </div>

            {/* Uploaded Documents List */}
            {additionalDocuments.length > 0 && (
              <div className="flex flex-col gap-3">
                {additionalDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center">
                        <FaCheck className="w-3 h-3 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#000] truncate">
                          {doc.displayName}
                        </p>
                        <p className="text-[11px] font-normal text-[#48484A] truncate">
                          {doc.fileName} · {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="flex-shrink-0 text-[13px] font-medium text-[#D70015] hover:text-[#D70015] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Sponsors and Partners Section */}
          <div className="p-5 space-y-6 border-t border-[#E5E5EA]">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-semibold text-[#000]">
                Key Sponsors and Partners
              </h3>
              <Button
                onClick={handleAddSponsor}
                variant="secondary"
                size="sm"
                icon={<FaPlusIcon />}
                iconPosition="left"
                className=""
              >
                Add Sponsor
              </Button>
            </div>

            {/* Sponsors List */}
            {sponsors.length > 0 && (
              <div className="space-y-6">
                {sponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    className="relative rounded-[15px] p-6 bg-gradient-to-br from-[rgba(155,60,255,0.07)] to-[rgba(45,103,255,0.07)]"
                  >
                    {/* Cross icon on top right of card */}
                    <button
                      onClick={() => handleRemoveSponsor(sponsor.id)}
                      disabled={deletingSponsorId === sponsor.id}
                      className="absolute top-[-10px] right-[-10px] w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm z-10 border border-[#E5E5EA] disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Remove sponsor"
                    >
                      {deletingSponsorId === sponsor.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#000]"></div>
                      ) : (
                        <FaXmark className="w-3.5 h-3.5 text-[#000]" />
                      )}
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Section - Logo Upload */}
                      <div className="flex flex-col items-center justify-center gap-3">
                        <input
                          ref={(el) => {
                            sponsorLogoRefs.current[sponsor.id] = el;
                          }}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleSponsorLogoUpload(sponsor.id, e)
                          }
                          className="hidden"
                        />
                        {sponsor.logo?.preview || sponsor.logo?.url ? (
                          <div className="flex flex-col items-center gap-3 w-full">
                            <div className="relative w-full flex items-center justify-center mb-2">
                              {/* Square logo container */}
                              <div className="relative w-[350px] h-[180px] flex items-center justify-center">
                                {uploadingLogoId === sponsor.id ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0734A9]"></div>
                                    <p className="text-[13px] text-[#48484A]">
                                      Uploading...
                                    </p>
                                  </div>
                                ) : (
                                  <img
                                    src={
                                      sponsor.logo?.url || sponsor.logo?.preview
                                    }
                                    alt="Sponsor logo preview"
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleSponsorLogoClick(sponsor.id)}
                              disabled={uploadingLogoId === sponsor.id}
                              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaArrowUpFromBracket />
                              Replace Logo
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col justify-center items-center gap-2.5 w-[50px] h-[50px] flex-shrink-0 rounded-full border border-[#E5E5EA] bg-white">
                              <img
                                src={logoIcon}
                                alt="Sponsor Logo"
                                className="w-5 h-5 object-cover"
                              />
                            </div>
                            <p className="text-[#000] text-[17px] font-semibold">
                              Sponsor Logo
                            </p>
                            <p className="text-[#000] text-center text-[13px] font-normal">
                              Upload a square branded logo file.
                            </p>
                            <button
                              onClick={() => handleSponsorLogoClick(sponsor.id)}
                              disabled={uploadingLogoId === sponsor.id}
                              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaArrowUpFromBracket />
                              {uploadingLogoId === sponsor.id
                                ? "Uploading..."
                                : "Upload Logo"}
                            </button>
                          </>
                        )}
                        <p className="text-[#000] text-center text-[11px] font-normal">
                          Recommended: high-quality image. Accepted formats:
                          JPG, PNG. Max 5 MB each.
                        </p>
                      </div>

                      {/* Right Section - Sponsor Details */}
                      <div className="space-y-4">
                        <AssetsInput
                          type="text"
                          name={`sponsor-name-${sponsor.id}`}
                          value={sponsor.name}
                          onChange={(e) =>
                            handleSponsorFieldUpdate(
                              sponsor.id,
                              "name",
                              e.target.value
                            )
                          }
                          label="Name"
                          maxLength={100}
                          showCharCount={true}
                          required={true}
                          error={
                            sponsorValidationErrors?.[
                              `sponsor_${sponsor.id}_name`
                            ]
                          }
                          placeholder="Enter Sponsor Name"
                        />
                        <AssetsInput
                          type="text"
                          name={`sponsor-value-${sponsor.id}`}
                          value={sponsor.value}
                          onChange={(e) =>
                            handleSponsorFieldUpdate(
                              sponsor.id,
                              "value",
                              e.target.value
                            )
                          }
                          label="Value"
                          maxLength={20}
                          showCharCount={true}
                          required={true}
                          error={
                            sponsorValidationErrors?.[
                              `sponsor_${sponsor.id}_value`
                            ]
                          }
                          placeholder="Enter Sponsor Value"
                          inputType="number"
                        />
                        <AssetsInput
                          type="text"
                          name={`sponsor-contract-${sponsor.id}`}
                          value={sponsor.contract}
                          onChange={(e) =>
                            handleSponsorFieldUpdate(
                              sponsor.id,
                              "contract",
                              e.target.value
                            )
                          }
                          label="Contract"
                          maxLength={20}
                          showCharCount={true}
                          required={true}
                          error={
                            sponsorValidationErrors?.[
                              `sponsor_${sponsor.id}_contract`
                            ]
                          }
                          placeholder="5 years"
                          inputType="number"
                          suffix="year"
                        />
                        <div>
                          <AssetsInput
                            type="url"
                            name={`sponsor-url-${sponsor.id}`}
                            value={sponsor.url}
                            onChange={(e) =>
                              handleSponsorFieldUpdate(
                                sponsor.id,
                                "url",
                                e.target.value
                              )
                            }
                            label="URL"
                            required={true}
                            hint={
                              !sponsorValidationErrors?.[
                                `sponsor_${sponsor.id}_url`
                              ]
                                ? "Enter a valid URL (e.g., https://example.com)"
                                : undefined
                            }
                            error={
                              sponsorValidationErrors?.[
                                `sponsor_${sponsor.id}_url`
                              ] ||
                              sponsor.urlError ||
                              undefined
                            }
                            placeholder="https://example.com"
                            inputType="url"
                          />
                        </div>
                        {/* Logo validation error */}
                        {sponsorValidationErrors?.[
                          `sponsor_${sponsor.id}_logo`
                        ] && (
                          <span className="text-xs font-medium text-red-500">
                            {
                              sponsorValidationErrors?.[
                                `sponsor_${sponsor.id}_logo`
                              ]
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Save Button - Bottom Center */}
                    <div className="flex justify-end ">
                      <Button
                        onClick={() => handleSaveSponsor(sponsor)}
                        disabled={
                          savingSponsorId === sponsor.id ||
                          sponsorValidationErrors?.[
                            `sponsor_${sponsor.id}_name`
                          ] ||
                          sponsorValidationErrors?.[
                            `sponsor_${sponsor.id}_value`
                          ] ||
                          sponsorValidationErrors?.[
                            `sponsor_${sponsor.id}_contract`
                          ] ||
                          sponsorValidationErrors?.[
                            `sponsor_${sponsor.id}_url`
                          ] ||
                          sponsorValidationErrors?.[
                            `sponsor_${sponsor.id}_logo`
                          ] ||
                          (sponsor.url &&
                            sponsor.url.trim() &&
                            sponsor.urlError) ||
                          (sponsorsSavedSuccessfully?.[sponsor.id] &&
                            !sponsorsFieldsModified?.[sponsor.id])
                        }
                        variant="gradient"
                        size="sm"
                        className="min-w-[120px]"
                      >
                        {savingSponsorId === sponsor.id
                          ? "Saving..."
                          : "Save Sponsor"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Publish to Marketplace Button */}
      <div className=" border-t py-6 border-[#E5E5EA]">
        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={handlePublishToMarketplace}
          disabled={!canPublishToMarketplace}
        >
          Publish to Marketplace
        </Button>
      </div>
    </div>
  );
}

export default MarketplaceListing;

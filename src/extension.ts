import * as vscode from 'vscode';

// Denne klasse håndterer logikken for at vise hover information
class SmartyHoverProvider implements vscode.HoverProvider {
  /**
   * Giver hover information for et specifikt punkt i et dokument.
   * VS Code kalder denne metode, når brugeren holder musen over kode.
   */
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken // Bruges til at afbryde operationen hvis nødvendigt
  ): vscode.ProviderResult<vscode.Hover> {
    // Kan returnere Hover, null, eller undefined

    // Regulært udtryk til at matche potentielle Smarty variabler/stier
    // Inkluderer: {$var}, $var (udenfor {}), $var.prop, $var->prop, $var[key], $smarty.const.SOMETHING
    // Dette er stadig en FORENKLING og fanger måske ikke alt eller fanger for meget.
    const smartyVariablePattern =
      // eslint-disable-next-line no-useless-escape
      /\{\$?[\w\-\>\[\]\.\$]+\}|(?<!\{)\$[\w\-\>\[\]\.]+/g;
    const wordRange = document.getWordRangeAtPosition(
      position,
      smartyVariablePattern
    );

    if (!wordRange) {
      return undefined; // Intet relevant fundet ved markøren
    }

    // Få teksten fra det fundne område
    const variableName = document.getText(wordRange);
    console.log(`Smarty Peek: Potential variable found: ${variableName}`);

    // Normaliser variabelnavnet (fjern f.eks. {$...} og start '$')
    let cleanVariableName = variableName
      .replace(/^\{\$?/, '')
      .replace(/\}$/, '');
    if (cleanVariableName.startsWith('$')) {
      cleanVariableName = cleanVariableName.substring(1);
    }

    // --- START PÅ DEN KOMPLEKSE DEL (SIMULERET) ---
    // Her skal den rigtige logik implementeres for at analysere 'cleanVariableName'
    // og bestemme dens type, struktur og eventuelt værdi.
    // Dette kræver sandsynligvis analyse af PHP-filer eller andre metoder.

    const markdown = new vscode.MarkdownString('', true); // 'true' muliggør trusted content som kommandoer
    markdown.supportHtml = true; // Tillad lidt HTML for styling om nødvendigt

    // SIMULERET LOGIK BASERET PÅ NAVN
    if (cleanVariableName.match(/^user(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `FrameUser Object (52) {
  Id: String;
  Username: String;
  CategoryId: String;
  CategorySecondaryId: Array(String);
  Type: String;
  Company: String;
  VatNumber: String;
  Ean: String;
  Firstname: String;
  Lastname: String;
  Gender: Int;
  Address: String;
  Zipcode: String;
  City: String;
  Country: String;
  State: String;
  Phone: String;
  CountryCode: String;
  Mobile: String;
  Fax: String;
  Email: String;
  DateOfBirth: String;
  Website: String;
  Active: Boolean;
  LanguageIso: String;
  LanguageAccess: Array(String);
  CurrencyIso: String;
  DiscountGroupId: Int;
  Newsletter: Boolean;
  Reference: String;
  Title: String;
  InterestFieldIds: Array(Int);
  PasswordChecksum: String;
  DebitorNumber: String;
  Address2: String;
  Consent: Boolean;
  ConsentDate: String;
  ShippingFirstname: String;
  ShippingLastname: String;
  ShippingCompany: String;
  ShippingAddress: String;
  ShippingAddress2: String;
  ShippingZipcode: String;
  ShippingCity: String;
  ShippingCountry: String;
  ShippingCountryCode: String;
  ShippingPhone: String;
  ShippingMobile: String;
  ShippingState: String;
  UserCategories: Array(Int);
  IsB2B: Boolean;
  CurrencyCode: String;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^general(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (20) {
  languageIso: String;
  languageTitle: String;
  languageIso639: String;
  deliveryCountryIso: String;
  deliveryCountryCode: Int;
  currencyIso: String;
  siteId: String;
  siteTitle: String;
  domain: String;
  dateFormat: String;
  dateTimeFormat: String;
  dateRSS: String;
  linkToCookies: String;
  searchOptions: Array();
  isShop: String;
  hasCartItems: Boolean;
  generator: String;
  subscriptionType: String;
  builtWithText: String;
  loginRecaptchaEnabled: Boolean;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^access(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (15) {
  newsletter: Boolean;
  user: String;
  social: Boolean;
  search: String;
  userLookup: String;
  shop: String;
  productfilter: Boolean;
  openCart: String;
  reviews: Boolean;
  tags: Boolean;
  wishlist: Boolean;
  discountCode: Boolean;
  giftCard: Boolean;
  relatedProducts: Boolean;
  customData: Boolean;

}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^contactdata(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (17) {
  name: String;
  company: String;
  address: String;
  zipcode: String;
  city: String;
  country: String;
  phone: String;
  fax: String;
  email: String;
  bankinfo: String;
  domain: String;
  url: String;
  displayUrl: String;
  contactperson: String;
  mobilephone: String;
  emaildummy: String;
  vatnumber: String;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^currency(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (7) {
  decimalCount: String;
  decimal: String;
  point: String;
  iso: String;
  symbol: String;
  symbolPlace: String;
  hasVat: Boolean;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^page(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (47) {
  id: String;
  folderId: String;
  categoryId: Null;
  productId: Null;
  parentId: String;
  name: String;
  type: String;
  title: String;
  headline: String;
  seoTitle: String;
  paths: Array<String>;
  url: String;
  request: String;
  orderId: Null;
  lastPath: String;
  savedPaths: Null;
  frontpageId: String;
  productPageId: String;
  isCart: Boolean;
  isCheckout: Boolean;
  isCheckoutComplete: Boolean;
  isCheckoutKlarna: Boolean;
  isFrontPage: Boolean;
  isProduct: Boolean;
  isBlog: Boolean;
  isCalendar: Boolean;
  isContact: Boolean;
  isForm: Boolean;
  isMedia: Boolean;
  isNews: Boolean;
  isPoll: Boolean;
  isSearch: Boolean;
  isText: Boolean;
  isFileSale: Boolean;
  isNewsletter: Boolean;
  isSitemap: Boolean;
  isSendToAFriend: Boolean;
  isPaymentPage: Boolean;
  is404: Boolean;
  isUserCreate: Boolean;
  isUserRequest: Boolean;
  isUserLogin: Boolean;
  isUserPasswordRecover: Boolean;
  isUserEdit: Boolean;
  isUserEditPassword: Boolean;
  isUserOrders: Boolean;
  isUserWishlist: Boolean;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^settings(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (170) {
  404_error_page: Boolean;
  api_google_analytics: String;
  api_google_webmaster: Boolean;
  blog_rss_enabled: String;
  breadcrumb: Boolean;
  cart_show_delivery_estimate: Boolean;
  checkout_delivery_datetime: String;
  checkout_reference_number: String;
  checkout_reference_number_required: String;
  checkout_show_delivery_address: Boolean;
  contactdata_footer: Boolean;
  cookies_link: String;
  custom_stylesheet: Boolean;
  design_logo: String;
  design_topbanner: String;
  filesale_order_status: String;
  frontend_closed: Boolean;
  frontend_ssl: Boolean;
  google_analytics_type: String;
  link_delivery_prices: Boolean;
  link_delivery_prices_b2b: Boolean;
  link_terms_and_conditions: String;
  link_terms_and_conditions_b2b: Boolean;
  module_gallery_cat_imageHeight: String;
  module_gallery_cat_imageWidth: String;
  module_gallery_list: String;
  module_gallery_list_amount: String;
  module_gallery_list_imageHeight: String;
  module_gallery_list_imageWidth: String;
  module_media_galleria_autoplay: Boolean;
  module_media_image_original: Boolean;
  module_media_image_thumb_crop: Boolean;
  module_media_player_height: String;
  module_media_player_online_info: Boolean;
  module_media_player_playlist_position: String;
  module_media_player_width: String;
  module_media_slider_height: String;
  module_media_slider_width: String;
  module_shop_cart_small: Boolean;
  module_shop_catlist_imageHeight: String;
  module_shop_catlist_imageWidth: String;
  module_shop_currency: Boolean;
  module_shop_discount_codes: Boolean;
  module_shop_language: Boolean;
  module_shop_manufacturer: Boolean;
  module_shop_one_step_checkout: Boolean;
  module_shop_one_step_checkout_full_page: Boolean;
  module_shop_order_note_picture: Boolean;
  module_shop_order_pdf_label_height: String;
  module_shop_order_pdf_label_width: String;
  module_shop_order_picklist_picture: Boolean;
  module_shop_packing: Boolean;
  module_shop_productlist: String;
  module_shop_productlist_allow_switch: String;
  module_shop_productlist_amount: String;
  module_shop_productlist_imageHeight: String;
  module_shop_productlist_imageWidth: String;
  module_shop_products_description_in_gallery: Boolean;
  module_shop_review_products: String;
  module_shop_review_products_type: String;
  module_shop_tag_products: Boolean;
  module_shop_tag_products_categories: Boolean;
  module_shop_topten_bought: Boolean;
  module_shop_topten_count: String;
  module_shop_topten_new: Boolean;
  module_shop_topten_offers: Boolean;
  module_shop_wishlist: Boolean;
  news_rss_enabled: String;
  news_signup: Boolean;
  news_signup_type: String;
  og_description: Boolean;
  og_image: Boolean;
  og_sitename: Boolean;
  og_title: Boolean;
  og_type: String;
  og_url: Boolean;
  products_discounts_rss_enabled: String;
  products_news_rss_enabled: String;
  product_add_jump_to_cart: Boolean;
  product_also_bought: Boolean;
  product_apply_variant_buy_price: Boolean;
  product_apply_variant_delivery_time: Boolean;
  product_apply_variant_discount: Boolean;
  product_apply_variant_price: Boolean;
  product_apply_variant_status: Boolean;
  product_apply_variant_status_empty: Boolean;
  product_apply_variant_stock: Boolean;
  product_apply_variant_unit: Boolean;
  product_apply_variant_weight: Boolean;
  product_browse: Boolean;
  product_list_show_buttons: Boolean;
  product_pdf_export: Boolean;
  product_related: Boolean;
  product_send_to_a_friend: Boolean;
  product_unique_itemnumber: Boolean;
  quicklink_printfriendly: Boolean;
  quicklink_sitemap: Boolean;
  shop_auto_stock: Boolean;
  shop_b2b_customer_approval: Boolean;
  shop_b2b_hidden_prices: Boolean;
  shop_customer_birthdate: Boolean;
  shop_customer_company: Boolean;
  shop_customer_company_validation: Boolean;
  shop_customer_institution: Boolean;
  shop_customer_institution_validation: Boolean;
  shop_customer_mobile: Boolean;
  shop_customer_mobile_validation: Boolean;
  shop_customer_phone: Boolean;
  shop_customer_phone_validation: Boolean;
  shop_delivery_hidden: Boolean;
  shop_productlist_amount_standard: String;
  shop_productlist_buy: Boolean;
  shop_productlist_sorting_bestseller: Boolean;
  shop_productlist_sorting_bestseller_overwrite: Boolean;
  shop_productlist_sorting_date: Boolean;
  shop_productlist_sorting_date_overwrite: Boolean;
  shop_productlist_sorting_number: Boolean;
  shop_productlist_sorting_number_overwrite: Boolean;
  shop_productlist_sorting_price: Boolean;
  shop_productlist_sorting_price_high: String;
  shop_productlist_sorting_price_high_overwrite: String;
  shop_productlist_sorting_price_overwrite: Boolean;
  shop_productlist_sorting_recommended: String;
  shop_productlist_sorting_recommended_sorting: String;
  shop_productlist_sorting_standard: String;
  shop_productlist_sorting_title: Boolean;
  shop_productlist_sorting_title_overwrite: Boolean;
  shop_product_delivery_time: String;
  shop_product_delivery_time_list: Boolean;
  shop_product_description_preview: Boolean;
  shop_product_image_structure: String;
  shop_product_incl_vat: Boolean;
  shop_product_number: Boolean;
  shop_product_out_of_stock_buy: Boolean;
  shop_product_price_from: Boolean;
  shop_product_sorting: Boolean;
  shop_product_tax_after_price: Boolean;
  shop_product_variant_structure: String;
  shop_product_weight: Boolean;
  shop_remember_cart: Boolean;
  shop_show_ex_vat_b2b: Boolean;
  shop_show_incl_vat: Boolean;
  show_product_icons: Boolean;
  social_facebook: Boolean;
  social_facebook_pageurl: String;
  social_google: Boolean;
  social_google_pageurl: String;
  social_instagram: Boolean;
  social_instagram_pageurl: String;
  social_pluggin_like_width: String;
  social_plugin_comment_number: String;
  social_plugin_comment_width: String;
  social_plugin_likebox_pageurl: String;
  social_twitter: Boolean;
  social_twitter_pageurl: String;
  solution_data_bank_info: String;
  spam_check: Boolean;
  spam_check_quick_signup: Boolean;
  spam_email_block: Boolean;
  spam_recaptcha_invisble_mode: Boolean;
  spam_recaptcha_version: String;
  template: String;
  template_smarty: String;
  theme_code: String;
  upload_max_height: String;
  upload_max_width: String;
  user_add: Boolean;
  user_password_resend: Boolean;
  use_dynamic_width: Boolean;
  useKlarna: Boolean;
}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^text(\.|->|$)/)) {
      markdown.appendMarkdown(`**Entity: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Origin:* Smarty Object\n');
      markdown.appendCodeblock(
        `Array (1074) {
  DATE_FORMAT: String; // "%d/%m %Y"
  DATE_FORMAT_EXT: String; // "%d/%m %Y kl. %H:%i"
  DATE_FORMAT_SMARTY: String; // "%d/%m %Y kl. %H:%M"
  TIME_FORMAT: String; // "%H:%M"
  NAME: String; // "Navn"
  FIRSTNAME: String; // "Fornavn"
  LASTNAME: String; // "Efternavn"
  ADRESS: String; // "Adresse"
  ADDRESS: String; // "Adresse"
  ADDRESS2: String; // "Adresse 2"
  POSTCODE: String; // "Postnummer"
  CITY: String; // "By"
  DELETE: String; // "Slet"
  COUNTRY: String; // "Land"
  STATE: String; // "Stat"
  COUNTRY_CODE: String; // "Landekode"
  CONTACT_PERSON: String; // "Kontakt person"
  TELEPHONE: String; // "Telefonnr."
  FAX: String; // "Fax"
  MOBILE: String; // "Mobil nr."
  MAIL: String; // "E-mail"
  MAIL_CONFIRM: String; // "Bekr&aelig;ft e-mail"
  WEB: String; // "Web"
  COMPANY: String; // "Firmanavn"
  BANK_DETAILS: String; // "Bankoplysninger"
  DELIVERY_ADDRESS: String; // "Leveringsadresse"
  BILLING_ADDRESS: String; // "Faktureringsadresse"
  NOW: String; // "Nu"
  PAID: String; // "Betalt"
  BEFORE: String; // "F&oslash;r"
  VAT_NR: String; // "CVR-nummer"
  SSN_NR: String; // "CPR-nummer"
  REFERENCE: String; // "Reference"
  EAN: String; // "EAN-nummer"
  PASSWORD: String; // "Adgangskode"
  PASSWORD_CONFIRM: String; // "Bekr&aelig;ft adgangskode"
  PEACES: String; // "stk."
  UPDATE: String; // "Opdater"
  BACK: String; // "Tilbage"
  CONFIRM: String; // "Godkend"
  BY: String; // "af"
  BY_C: String; // "Af"
  SEE: String; // "Se"
  OF: String; // "v/"
  CATEGORY: String; // "Kategori"
  CATEGORYS: String; // "Kategorier"
  CLICK: String; // "Klik"
  CLICK_HERE: String; // "Klik her"
  HERE: String; // "her"
  SEARCH: String; // "S&oslash;g"
  SEARCH_TEXT: String; // "Indtast s&oslash;gning"
  SEARCH_LONG: String; // "S&oslash;gning"
  SEARCH_LINK: String; // "soegning"
  SEE_MORE: String; // "Se mere"
  SUBJECT: String; // "Emne"
  MESSAGE: String; // "Besked"
  SEND: String; // "Send"
  CHOOSE: String; // "V&aelig;lg her"
  CHOOSE_VARIANT: String; // "V&aelig;lg"
  CHOOSE_VARIANT_ALL: String; // "Alle"
  CURRENCY: String; // "Valuta"
  LANGUAGE: String; // "Sprog"
  MANUFACTUERER: String; // "Producenter"
  ADD_PLURAL: String; // "er"
  EDIT: String; // "Redig&eacute;r"
  SAVE: String; // "Gem"
  SAVE_GO_BACK: String; // "Gem og g&aring; tilbage"
  FORWARD: String; // "Frem"
  NEXT: String; // "N&aelig;ste"
  NEXT_PAGE: String; // "N&aelig;ste side"
  LAST: String; // "Forrige"
  LAST_PAGE: String; // "Forrige side"
  OUT_OF: String; // "af"
  DELIVERY: String; // "Fragt"
  DATE_THE: String; // "d."
  DATE_THE_C: String; // "D."
  ORDER: String; // "Bestil"
  YOUR_ACCOUNT: String; // "Din konto"
  YOUR_USER: String; // "Din bruger"
  ACCOUNT: String; // "Konto"
  ALREADY_CREATED: String; // "Allerede oprettet"
  USER: String; // "Bruger"
  SHOP_BY: String; // "Shop efter"
  LINK: String; // "Link"
  PRINT_TEXT: String; // "Printvenlig"
  CONTACT_TEXT: String; // "Kontakt"
  GENERATED: String; // "Genereret"
  DEAR: String; // "Hej"
  FREE: String; // "Gratis"
  DEMO_TEXT: String; // "Dette er en demo version..."
  COOKIE_TEXT: String; // "Cookies er sl&aring;et fra i din browser. Genindl&aelig;s venligst websitet."
  PAGES: String; // "Sider"
  AND_SEPERATOR: String; // "og"
  SMS: String; // "SMS"
  BIRTHDATE: String; // "F&oslash;dselsdato"
  TOP: String; // "Top"
  IP_ADDRESS: String; // "IP-adresse"
  SOURCE_PORT: String; // "Source port"
  FRONTPAGE: String; // "Forside"
  OPTIONS: String; // "Muligheder"
  PUBLIC: String; // "Offentlig"
  YES: String; // "Ja"
  NO: String; // "Nej"
  SHOW_FRONTPAGE: String; // "Vis forside"
  SHOW_WEBSITE: String; // "Vis alm. hjemmeside"
  SHOW_WEBSHOP: String; // "Vis alm. webshop"
  DISCOUNT: String; // "Rabat"
  FEE: String; // "Gebyr"
  MODAL_CLOSE: String; // "Luk vindue"
  PREVIOUS: String; // "Forrige"
  NEWS: String; // "Nyhed"
  SALE: String; // "Tilbud"
  DESCRIPTION: String; // "Beskrivelse"
  SPECIFICATIONS: String; // "Specifikationer"
  FILES: String; // "Filer"
  TAGS: String; // "Tags"
  RATING: String; // "Bed&oslash;mmelse"
  SOLD_OUT: String; // "Udsolgt"
  DOWNLOAD: String; // "Download"
  COMMENTS: String; // "Kommentarer"
  COMMENT_TO: String; // "Som kommentar til"
  GO_TO_FRONTPAGE: String; // "G&aring; til forsiden"
  INSERT_AMOUNT: String; // "Indtast antal"
  UNDER: String; // "under"
  IN: String; // "i"
  BASED_ON: String; // "Baseret p&aring;"
  MINIMUM_BUY: String; // "Minimum k&oslash;b"
  DOWNLOADS: String; // "Downloads"
  SOCIAL_MEDIA: String; // "Social media"
  SHOW_ALL: String; // "Vis alle"
  PRODUCTS: String; // "vare(r)"
  EXTRABUY_CATEGORY: String; // "Kategori"
  IMAGE_PLACEHOLDER_TEXT: String; // "Billede kommer"
  CHOOSE_PACKET: String; // "V&aelig;lg vare i pakke produkt."
  CHOOSE_COUNTRY: String; // "V&aelig;lg land"
  PAGINATION_PAGE: String; // "Side"
  CUSTOMER_TYPE: String; // "Kundetype"
  CUSTOMER_TYPE_PRIVATE: String; // "Privat"
  CUSTOMER_TYPE_COMPANY: String; // "Virksomhed"
  CUSTOMER_TYPE_INSTITUTION: String; // "EAN/Offentlig"
  COMPANY_OR_INSTITUTION: String; // "Institutions-/Firmanavn"
  DATE_MONTH_JANUARY: String; // "Januar"
  DATE_MONTH_FEBRUARY: String; // "Februar"
  DATE_MONTH_MARCH: String; // "Marts"
  DATE_MONTH_APRIL: String; // "April"
  DATE_MONTH_MAY: String; // "Maj"
  DATE_MONTH_JUNE: String; // "Juni"
  DATE_MONTH_JULY: String; // "Juli"
  DATE_MONTH_AUGUST: String; // "August"
  DATE_MONTH_SEPTEMBER: String; // "September"
  DATE_MONTH_OCTOBER: String; // "Oktober"
  DATE_MONTH_NOVEMBER: String; // "November"
  DATE_MONTH_DECEMBER: String; // "December"
  DATE_DAY_MONDAY: String; // "Mandag"
  DATE_DAY_TUESDAY: String; // "Tirsdag"
  DATE_DAY_WEDNESDAY: String; // "Onsdag"
  DATE_DAY_THURSDAY: String; // "Torsdag"
  DATE_DAY_FRIDAY: String; // "Fredag"
  DATE_DAY_SATURDAY: String; // "L&oslash;rdag"
  DATE_DAY_SUNDAY: String; // "S&oslash;ndag"
  USER_DASHBOARD_LINK: String; // "min-konto"
  USER_DASHBOARD_HEADLINE: String; // "Min konto"
  USER_DASHBOARD_MENU: String; // "Min konto"
  USER_FAVORITES_LINK: String; // "mine-favoritter"
  USER_FAVORITES_HEADLINE: String; // "Favoritter"
  USER_FAVORITES_MENU: String; // "Favoritter"
  USER_NEWSLETTER_LINK: String; // "mine-nyhedsbrevs-indstillinger"
  USER_NEWSLETTER_HEADLINE: String; // "Nyhedsbrev"
  USER_NEWSLETTER_MENU: String; // "Nyhedsbrev"
  USER_DELETE_LINK: String; // "slet-konto"
  USER_DELETE_HEADLINE: String; // "Slet konto"
  USER_DELETE_MENU: String; // "Slet konto"
  USER_ADD_HEADLINE: String; // "Opret bruger"
  USER_ADD_MENU: String; // "Opret bruger"
  USER_ADD_LINK: String; // "opret-bruger"
  USER_ADD_SAVE_DELIVERY_ADDRESS: String; // "Jeg &oslash;nsker at gemme en leveringsadresse"
  USER_ADD_B2B_HEADLINE: String; // "Ans&oslash;g om bruger (B2B)"
  USER_ADD_B2B_MENU: String; // "Ans&oslash;g om bruger (B2B)"
  USER_ADD_B2B_LINK: String; // "ansoeg-om-bruger"
  USER_ADD_B2B_TEXT: String; // "Denne formular er forbeholdt kunder som &oslash;nsker B2B forhandler log ind."
  USER_ADD_TEXT: String; // "Indtast venligst dine informationer."
  USER_ADD_REQUIRED_FIELDS: String; // "Felter markeret med * er obligatoriske"
  USER_ADD_ERROR_INCORRECT_FIELD: String; // "er ikke udfyldt korrekt"
  USER_ADD_ERROR_INCORRECT_FIELD_ZIP: String; // "skal udfyldes med 4 cifre"
  USER_ADD_ERROR_REQUIRED_FIELD: String; // "mangler at blive udfyldt"
  USER_ADD_ERROR_PASSWORD_TOO_SHORT: String; // "Den valgte adgangskode er for kort (mindst 4 karakterer)"
  USER_ADD_ERROR_PASSWORD_NOT_ALIKE: String; // "Bekr&aelig;ftelsen af din adgangskode er ikke korrekt"
  USER_ADD_ERROR_MAIL_NOT_VALID: String; // "Den valgte e-mail adresse er ikke korrekt indtastet"
  USER_ADD_ERROR_BIRTHDATE_NOT_VALID: String; // "Den valgte f&oslash;dselsdato er ikke korrekt indtastet"
  USER_ADD_ERROR_MAIL_NOT_ALIKE: String; // "Bekr&aelig;ftelsen af din e-mail er ikke korrekt"
  USER_ADD_ERROR_MAIL_IN_USE: String; // "Den valgte e-mail adresse er allerede i brug"
  USER_ADD_ERROR_USER_DELIVERY_NO_MATCH: String; // "Dit leveringsland er ikke tilg&aelig;ngeligt p&aring; dette sproglag. Skift t..."
  USER_ADD_ERROR_USER_DELIVERY_METHOD_NO_AVAILABLE: String; // "Et eller flere produkter kan ikke leveres til det valgte leveringsland"
  USER_ADD_MAIL_SUBJECT: String; // "Konto p&aring; Bewise"
  USER_ADD_MAIL_SUCCESS: String; // "Din konto er oprettet og du er nu logget ind"
  USER_ADD_B2B_SUCCESS: String; // "Din ans&oslash;gning om login er registreret og sendt. Fortsat god dag."
  USER_ADD_B2B_MAIL_SUBJECT: String; // "Ans&oslash;gning om bruger p&aring; Bewise"
  USER_ADD_B2B_MAIL_TEXT: String; // "Nedenst&aring;ende bruger &oslash;nsker login p&aring; Bewise:"
  USER_DELETE_FORM_TITLE: String; // "Slet bruger"
  USER_DELETE_FORM_TEXT: String; // "Du kan slette din bruger nedenfor, hvis du ikke l&aelig;ngere &oslash;nsker a..."
  USER_DELETE_FORM_CONFIRM_TEXT: String; // "ER DU SIKKER P&Aring; DU VIL SLETTE DIN KONTO?"
  USER_DELETE_ERROR_NO_LOGIN: String; // "Denne funktion kr&aelig;ver at du er logget ind"
  USER_DELETE_ERROR_NO_EMAIL: String; // "For at slette en brugerkonto, skal den have en valid e-mail tilknyttet."
  USER_DELETE_ERROR_UNKNOWN: String; // "Der opstod en fejl. Brugerkontoen kunne ikke slettes"
  USER_DELETE_SUCCESS_MAIL: String; // "En e-mail med et bekr&aelig;ftelses link er blevet sendt."
  USER_DELETE_SUCCESS_REMOVED: String; // "Din brugerkonto er blevet slettet."
  USER_DELETE_MAIL_SUBJECT: String; // "Bekr&aelig;ftelse p&aring; sletning af brugerkonto fra $1"
  USER_DELETE_MAIL_SUBJECT_CONFIRM: String; // "Din brugerkonto er blevet slettet fra $1"
  USER_DELETE_MAIL_TEXT: String; // "Klik venligst p&aring; <a href="$1">dette link</a> for at bekr&aelig;fte slet..."
  USER_DELETE_MAIL_TEXT_CONFIRM: String; // "Din brugerkonto p&aring; $1 er blevet slettet."
  USER_FORCED_LOGOUT: String; // "Du er blevet logget ud da din brugerprofil ikke har adgang til denne side."
  USER_ONLY_FOR_COMPANIES: String; // "(kun for virksomheder)"
  USER_ONLY_FOR_INSTITUTIONS: String; // "(kun for institutioner)"
  USER_WHERE_FIND_US: String; // "Hvor h&oslash;rte du om"
  USER_WHERE_FIND_US_NONE: String; // "Intet svar"
  USER_NEWSLETTER: String; // "Jeg &oslash;nsker at modtage nyhedsbrevet"
  USER_NEWSLETTER_CHOOSE_INTEREST_GROUPS: String; // "V&aelig;lg interessegruppe(r)"
  USER_NEWSLETTER_REGISTER_HEADER: String; // "Bekr&aelig;ft $1 af nyhedsbrev p&aring; $2"
  USER_NEWSLETTER_REGISTER_HEADER_SUBSCRIBE: String; // "tilmelding"
  USER_NEWSLETTER_REGISTER_HEADER_UNSUBSCRIBE: String; // "afmelding"
  USER_NEWSLETTER_REGISTER_BODY: String; // "Klik venligst p&aring; <a href="$1">dette link</a> for at bekr&aelig;fte $2 a..."
  USER_NEWSLETTER_REGISTER_FLASH_SUBSCRIBE: String; // "Der er afsendt en e-mail med link til bekr&aelig;ftelse af $1 til nyhedsbrevet"
  USER_NEWSLETTER_REGISTER_CONFIRMATION_HEADER_SUBSCRIBE: String; // "Tak for din tilmelding"
  USER_NEWSLETTER_REGISTER_CONFIRMATION_BODY_SUBSCRIBE: String; // "Tak for din tilmelding hos $1.<br><br>Du er nu registreret og vil modtage vor..."
  USER_NEWSLETTER_REGISTER_CONFIRMATION_HEADER_UNSUBSCRIBE: String; // "Tak for din afmelding"
  USER_NEWSLETTER_REGISTER_CONFIRMATION_BODY_UNSUBSCRIBE: String; // "Tak for din afmelding hos $1.<br><br>Du vil ikke l&aelig;ngere modtage vores ..."
  USER_PASSWORD_TEXT: String; // "mindst 4 bogstaver eller tal"
  USER_UPDATE_HEADLINE: String; // "Mine oplysninger"
  USER_UPDATE_MENU: String; // "Mine oplysninger"
  USER_UPDATE_LINK: String; // "mine-oplysninger"
  USER_UPDATE_PROFILE_ERROR: String; // "Alle felter med * skal udfyldes"
  USER_UPDATE_PROFILE_HEADER: String; // "OPDATER KONTO"
  USER_UPDATE_PROFILE_TEXT: String; // "Hold venligst dine oplysninger opdateret"
  USER_UPDATE_PROFILE_SUCCESS: String; // "Dine oplysninger er nu opdateret"
  USER_UPDATE_PROFILE_NO_SUCCESS: String; // "Dine oplysninger er ikke indtastet korrekt"
  USER_UPDATE_EMAIL_HEADLINE: String; // "Skift e-mail"
  USER_UPDATE_EMAIL_LINK: String; // "skift-email"
  USER_UPDATE_EMAIL_TEXT: String; // "Indtast en ny e-mail nedenfor"
  USER_UPDATE_EMAIL_SUCCESS: String; // "Din e-mail er nu opdateret"
  USER_UPDATE_PASSWORD_HEADLINE: String; // "Skift adgangskode"
  USER_UPDATE_PASSWORD_MENU: String; // "Skift adgangskode"
  USER_UPDATE_PASSWORD_LINK: String; // "skift-adgangskode"
  USER_UPDATE_PASSWORD_TEXT: String; // "Benyt venligst nedenst&aring;ende formular, hvis du &oslash;nsker at skifte a..."
  USER_UPDATE_PASSWORD_PRESENT: String; // "Nuv&aelig;rende adgangskode"
  USER_UPDATE_PASSWORD_NEW: String; // "Ny adgangskode"
  USER_UPDATE_PASSWORD_NEW_CONFIRM: String; // "Bekr&aelig;ft ny adgangskode"
  USER_UPDATE_PASSWORD_ERROR_NOT_SAME: String; // "Den bekr&aelig;ftede adgangskode er ikke indtastet korrekt"
  USER_UPDATE_PASSWORD_SUCCESS: String; // "Din adgangskode er skiftet"
  USER_UPDATE_PASSWORD_FAIL: String; // "Din nuv&aelig;rende adgangskode er ikke indtastet korrekt"
  USER_UPDATE_PASSWORD_EROR: String; // "Felterne er ikke udfyldt korrekt"
  USER_REMEMBER_LOGIN: String; // "Husk log ind"
  USER_MALE: String; // "Mand"
  USER_FEMALE: String; // "Kvinde"
  USER_GENDER: String; // "K&oslash;n"
  USER_DATA_EXPORT_MISSING_LOGIN: String; // "Du skal v&aelig;re logget ind for at downloade dine data. Log ind og brug lin..."
  USER_DATA_EXPORT_NO_DATA: String; // "Dine data er ikke klar til download. Kontakt venligst vores support."
  USER_BLOCKED: String; // "Brugeren er blokeret."
  FILE_SALE_HEADLINE: String; // "Download produkt"
  FILE_SALE_MENU: String; // "Download produkt"
  FILE_SALE_LINK: String; // "filesale-download"
  FILESALE_ERROR_LINK: String; // "Forkert link"
  FILESALE_ERROR_URL: String; // "Filen blev ikke fundet"
  PAGE_NOT_FOUND: String; // "Siden blev ikke fundet"
  PAGE_NOT_FOUND_TEXT: String; // "Den side, som du fors&oslash;gte at se, blev desv&aelig;rre ikke fundet.<br /..."
  FILESALE_ERROR_PERIOD: String; // "Filen kan ikke downloades l&aelig;ngere (perioden er overskredet)"
  FILESALE_ERROR_NUMBER: String; // "Filen kan ikke downloades l&aelig;ngere (antal downloads overskredet)"
  SEND_PASSWORD_HEADLINE: String; // "Glemt adgangskode"
  SEND_PASSWORD_MENU: String; // "Glemt adgangskode"
  SEND_PASSWORD_LINK: String; // "glemt-adgangskode"
  SEND_PASSWORD_TEXT: String; // "Har du oprettet en konto hos os, kan du f&aring; tilsendt din adgangskode her."
  SEND_PASSWORD_QUESTION: String; // "Glemt din adgangskode?"
  SEND_PASSWORD_YOUR_USERNAME: String; // "Dit brugernavn:"
  SEND_PASSWORD_YOUR_PASSWORD: String; // "Din adgangskode:"
  SEND_PASSWORD_MAIL_SUBJECT: String; // "Glemt adgangskode"
  SEND_PASSWORD_MAIL_SUCCESS: String; // "Om f&aring; minutter vil der blive afsendt en e-mail med dine bruger-oplysninger"
  SEND_PASSWORD_MAIL_NOT_KNOWN: String; // "Den indtastede e-mail adresse er ikke registreret hos os"
  RECOVER_PASSWORD_TEXT: String; // "Indtast din nye adgangskode."
  RECOVER_PASSWORD_MAIL_MESSAGE_SUCCESS: String; // "Du modtager om f&aring; minutter en skift adgangskode e-mail."
  RECOVER_PASSWORD_MAIL_MESSAGE_ALREADY_SENT: String; // "E-mail allerede sendt. En ny kan sendes efter en time."
  RECOVER_PASSWORD_MAIL_TEXT: String; // "Du er ved at skifte adgangskode for denne konto:<br />$1<br /><br />Klik p&ar..."
  RECOVER_PASSWORD_MAIL_TEXT_SUCCESS: String; // "Din adgangskode er nu &aelig;ndret. Fortsat god dag.<br /><br />Med venlig hi..."
  RECOVER_PASSWORD_MAIL_SUBJECT_SUCCESS: String; // "Adgangskode &aelig;ndret"
  RECOVER_PASSWORD_MESSAGE_SUCCESS: String; // "Din adgangskode er &aelig;ndret. Du kan nu logge ind."
  RECOVER_PASSWORD_MESSAGE_FAIL: String; // "Ugyldig &aelig;ndring af adgangskoden."
  RECOVER_PASSWORD_CODE_FAIL: String; // "Din kode er allerede brugt eller udl&oslash;bet. Hent en ny kode og pr&oslash..."
  RECOVER_PASSWORD_LINK: String; // "opret-adgangskode"
  RECOVER_PASSWORD_MENU: String; // "Opret adgangskode"
  RECOVER_PASSWORD_HEADLINE: String; // "Opret adgangskode"
  LOGIN_HEADLINE: String; // "Log ind"
  LOGIN_MENU: String; // "Log ind"
  LOGIN_LINK: String; // "log-ind"
  LOGIN_TEXT: String; // "Hvis du har en konto hos os, bedes du logge ind her"
  LOGIN_USER: String; // "Din e-mail"
  LOGIN_USER_MISSING: String; // "E-mail skal udfyldes"
  LOGIN_TOKEN_NOT_MATCHING: String; // "Det angivne login-link er ugyldigt, eller det er allerede brugt"
  LOGIN_PASSWORD: String; // "Din adgangskode"
  LOGIN_PASSWORD_MISSING: String; // "Adgangskode skal udfyldes"
  LOGIN_USER_FAIL: String; // "Der er ingen bruger fundet med det brugernavn og adgangskode"
  LOGIN_USER_WELCOME: String; // "Velkommen "
  LOGIN_USER_WELCOME_MESSAGE: String; // "Du er nu logget ind"
  LOGIN_USER_WELCOME_MESSAGE_CART_ADD: String; // "<br />Der er tilf&oslash;jet produkter til din <a href="/kurv/">indk&oslash;b..."
  LOGOUT_HEADLINE: String; // "Log ud"
  LOGOUT_MESSAGE: String; // "Du er nu logget ud"
  MY_ORDERS_HEADLINE: String; // "Mine ordrer"
  MY_ORDERS_MENU: String; // "Mine ordrer"
  MY_ORDERS_LINK: String; // "mine-ordrer"
  MY_ORDERS_HISTORY: String; // "Ordre historik"
  MY_ORDERS_POPULAR: String; // "Mest k&oslash;bte varer"
  MY_ORDERS_NUMBER: String; // "Nr."
  MY_ORDERS_REFERENCE_NUMBER: String; // "Referencenummer"
  MY_ORDERS_LINES: String; // "Ordre"
  MY_ORDERS_PRICE: String; // "Pris total"
  MY_ORDERS_DATE: String; // "Ordredato"
  MY_ORDERS_STATUS: String; // "Status"
  MY_ORDERS_DETAILS: String; // "Detaljer"
  MY_ORDERS_DETAILS_SEE: String; // "Se detaljer"
  MY_ORDERS_CUSTOMER_COMMENT: String; // "Din kommentar"
  MY_ORDERS_SHOP_COMMENT: String; // "Shop kommentar"
  MY_ORDERS_SENT: String; // "Ordre sendt"
  MY_ORDERS_SENT_VARIABLE: String; // "Ordre sendt (Nr. #ORDER_NUMBER#)"
  MY_ORDERS_PDF_INVOICE_CONTENT: String; // "Vi fremsender hermed faktura for en eller flere varer, som vi har afsendt til..."
  MY_ORDERS_PDF_CREDIT_NOTE_CONTENT: String; // "Vi fremsender hermed kreditnota. Kreditnotaen er vedh&aelig;ftet som PDF fil,..."
  MY_ORDERS_TRACKING: String; // "Tracking nummer"
  MY_ORDERS_TRACKING_VARIABLE: String; // "Tracking nummer (Nr. #ORDER_NUMBER#)"
  MY_ORDERS_INVOICE: String; // "Faktura"
  MY_ORDERS_INVOICE_VARIABLE: String; // "Faktura (Nr. #INVOICE_NUMBER#)"
  MY_ORDERS_INVOICE_NUMBER: String; // "Fakturanummer"
  MY_ORDERS_INVOICE_DATE: String; // "Fakturadato"
  MY_ORDERS_INVOICE_DUE_DATE: String; // "Forfaldsdato"
  MY_ORDERS_RECEIPT: String; // "Kvittering"
  MY_ORDERS_RECEIPT_VARIABLE: String; // "Kvittering (Nr. #INVOICE_NUMBER#)"
  MY_ORDERS_RECEIPT_NUMBER: String; // "Kvitteringsnummer"
  MY_ORDERS_CARD_FEE: String; // "Transaktionsgebyr:"
  MY_ORDERS_FEE: String; // "Betalingsgebyr:"
  MY_ORDERS_NONE: String; // "Der er ingen ordrer registreret for denne konto."
  MY_ORDERS_DETAILS_NONE: String; // "Ordren findes ikke."
  MY_ORDERS_REPAY_SUBJECT: String; // "Din ordre #$1 p&aring; Bewise er &aelig;ndret"
  MY_ORDERS_REPAY_BODY: String; // "Din ordre #$1 p&aring; Bewise er &aelig;ndret og ordretotalen er opjusteret. ..."
  MY_ORDERS_PAY_SUBJECT: String; // "Betalingslink for din ordre #$1 p&aring; Bewise"
  MY_ORDERS_PAY_BODY: String; // "Klik <a href='$2'>her</a> for at foretage betalingen ($2). Med venlig hilsen..."
  MY_ORDERS_REORDER: String; // "Genbestil"
  MY_ORDERS_REORDER_MESSAGE: String; // "Din ordre er overf&oslash;rt til indk&oslash;bskurven."
  MY_ORDERS_REORDER_MESSAGE_NOTE: String; // "Bem&aelig;rk! Ordren indeholder %s som skal genbestilles s&aelig;rskilt."
  MY_ORDERS_REORDER_MESSAGE_NOTE_ADDITIONAL: String; // "produkter med tilvalg"
  MY_ORDERS_REORDER_MESSAGE_NOTE_TYPES: String; // "gavekort eller gaveindpakning"
  MY_ORDERS_REORDER_MESSAGE_ERROR: String; // "Din genbestilling blev afvist."
  MY_ORDERS_READY_PICKUP: String; // "Klar til afhentning"
  MY_ORDERS_READY_PICKUP_VARIABLE: String; // "Klar til afhentning (Nr. #ORDER_NUMBER#)"
  MY_ORDERS_PARTIALLY: String; // "Delvist afsendt"
  MY_ORDERS_PARTIALLY_VARIABLE: String; // "Delvist afsendt (Nr. #ORDER_NUMBER#)"
  MY_ORDERS_STOCK_SOLD: String; // "antal ved salg"
  MY_ORDERS_ORIGINAL_ORDER: String; // "Original ordre"
  MY_ORDERS_ORDER_CREDIT: String; // "Kreditnota"
  MY_ORDERS_ORDER_CREDIT_VARIABLE: String; // "Kreditnota (Nr. #INVOICE_NUMBER#)"
  MY_ORDERS_ORDER_COPY: String; // "Del-ordre"
  MY_ORDERS_ORDER_STATUS_CHANGED: String; // "Ny ordrestatus: #ORDER_STATUS# (Nr. #ORDER_NUMBER#)"
  NEWLSLETTER_HEADLINE: String; // "Nyhedstilmelding/afmelding"
  NEWLSLETTER_MENU: String; // "Nyhedstilmelding"
  NEWLSLETTER_LINK: String; // "tilmeld-nyhedsbrev"
  NEWLSLETTER_TEXT: String; // "&Oslash;nsker du at blive tilmeldt eller afmeldt nyheder, kan du indtaste din..."
  NEWLSLETTER: String; // "Nyhedsbrev"
  NEWLSLETTER_HEADLINE_QUICK: String; // "Tilmeld dig"
  NEWSLETTER_SIGNIN: String; // "Tilmeld"
  NEWSLETTER_UPDATE_ERROR: String; // "En fejl opstod. Tilmeldingen til nyhedsbrevet kunne ikke opdateres."
  NEWSLETTER_SIGNIN_MAIL_IN_USE: String; // "De indtastede oplysninger er allerede registreret i vores bruger-database, og..."
  NEWSLETTER_SIGNIN_SUCCESS: String; // "Tilmeldingen er registreret. Tak for det."
  NEWSLETTER_SIGNOFF: String; // "Afmeld"
  NEWSLETTER_SIGNOFF_MAIL_NOT_IN_USE: String; // "De indtastede oplysninger er ikke registreret i vores bruger-database, og kan..."
  NEWSLETTER_SIGNOFF_SUCCESS: String; // "Afmeldingen er registreret. Tak for det."
  SEND_TO_A_FRIEND_HEADLINE: String; // "Tip en ven"
  SEND_TO_A_FRIEND_MENU: String; // "Tip en ven"
  SEND_TO_A_FRIEND_LINK: String; // "tip-en-ven"
  SEND_TO_A_FRIEND_TEXT: String; // "Send f&oslash;lgende link til &eacute;n du kender, ved at udfylde nedenst&ari..."
  SEND_TO_A_FRIEND_NAME_YOURS: String; // "Dit navn"
  SEND_TO_A_FRIEND_NAME_FRIEND: String; // "Modtagers navn"
  SEND_TO_A_FRIEND_MAIL_FRIEND: String; // "Modtagers e-mail"
  SEND_TO_A_FRIEND_COMMENT: String; // "Kommentar"
  SEND_TO_A_FRIEND_MAIL_SUBJECT: String; // "Anbefaling fra en ven"
  SEND_TO_A_FRIEND_MAIL_TEXT_LINK: String; // "har sendt dig et link til"
  SEND_TO_A_FRIEND_MAIL_TEXT_COMMENT: String; // "Kommentar fra afsender:"
  SEND_TO_A_FRIEND_MAIL_SUCCESS: String; // "Din anbefaling er sendt. Tak for det."
  SITEMAP_HEADLINE: String; // "Sitemap"
  SITEMAP_MENU: String; // "Sitemap"
  SITEMAP_LINK: String; // "sitemap"
  SITEMAP_LINK_PAGES: String; // "sider"
  SITEMAP_LINK_CATEGORIES: String; // "kategorier"
  SITEMAP_LINK_PRODUCTS: String; // "produkter"
  SITEMAP_TEXT_TOP: String; // "Her kan du finde en oversigt over links p&aring; Bewise."
  SITEMAP_VIEW_ALL_PAGES: String; // "Vis alle sider"
  SITEMAP_VIEW_ALL_CATEGORIES: String; // "Vis alle kategorier"
  SITEMAP_VIEW_ALL_PRODUCTS: String; // "Vis alle produkter"
  CART_HEADLINE: String; // "Indk&oslash;bskurv"
  CART_MENU: String; // "Indk&oslash;bskurv"
  CART_LINK: String; // "kurv"
  CART_FROM: String; // "fra indk&oslash;bskurv"
  CART_ADD_SUCCESS: String; // "Varen er lagt i din indk&oslash;bskurv."
  CART_ADD_SUCCESS_LINK: String; // "<a href="/kurv/">G&aring; til indk&oslash;bskurven</a>."
  CART_ITEM_DELETE_SUCCESS: String; // "Varen er slettet fra din indk&oslash;bskurv"
  CART_UPDATE_SUCCESS: String; // "Din indk&oslash;bskurv er opdateret"
  CART_UPDATE_EMPTY: String; // "Din indk&oslash;bskurv er t&oslash;mt"
  CART_UPDATE: String; // "Opdater kurv"
  CART_EMPTY: String; // "T&oslash;m kurv"
  CART_IS_EMPTY: String; // "Din indk&oslash;bskurv er tom"
  CART_SHOW: String; // "Vis kurv"
  CART_GO_TO: String; // "G&aring; til indk&oslash;bskurv"
  CART_PRODUCTS: String; // "Varer"
  CART_PICTURE: String; // " "
  CART_NOTE: String; // "Note"
  CART_PRICE: String; // "Pris"
  CART_COUNT: String; // "Antal"
  CART_PRICE_ALL: String; // "I alt"
  CART_PRICE_SUM: String; // "Samlet k&oslash;b:"
  CART_ACTION_ERROR: String; // "Action fejl i kurven"
  CART_BUY_MORE: String; // "K&oslash;b mere"
  CART_PRODUCT_DEAD_TITLE: String; // "Udg&aring;et produkt"
  CART_PRODUCT_DEAD_NOTE: String; // "Produktet er udg&aring;et og kan derfor ikke bestilles"
  CART_COUPON_NOT_AVAILABLE: String; // "Gavekortet kan ikke bruges p&aring; dette sprog"
  CART_COUPON_ONLY_SELECTED_PRODUCTS: String; // "Virker kun for udvalgte produkter"
  CART_PRODUCT_OVER_STOCK_LIMIT: String; // "Det &oslash;nskede antal af produktet er ikke p&aring; lager"
  CART_DEAD: String; // "Du kan ikke g&aring; til bestilling, da der er et produkt i din indk&oslash;b..."
  CART_DELIVERY_FROM: String; // "Fragt estimat:"
  CART_TOTAL_WITH_DELIVERY: String; // "K&oslash;b med fragt:"
  CART_TOTAL: String; // "Total:"
  CART_VAT_INCLUSIVE: String; // "Heraf moms:"
  CART_VAT_EXCLUSIVE: String; // "Moms:"
  CART_ADD_ERROR_EMPTY: String; // "Husk at v&aelig;lge antal"
  CART_ADD_ERROR_MIN_AMOUNT: String; // "Det er ikke muligt at k&oslash;be det valgte antal af produktet"
  CART_ADD_ERROR_MIN_AMOUNT_EXTRA_BUY: String; // "Bem&aelig;rk, at et eller flere tilk&oslash;bsprodukter ikke blev tilf&oslash..."
  CART_ADD_ERROR_EXTENDED_OPENCART_IP: String; // "Ugyldig &aring;ben indk&oslash;bskurv IP-adresse"
  CART_ADD_ERROR_EXTENDED_OPENCART_CODE: String; // "Ugyldig &aring;ben indk&oslash;bskurv kode"
  CART_ADD_ERROR_EXTENDED_OPENCART_PRODUCT_NONE: String; // "Produktet findes ikke"
  CART_ADD_ERROR_EXTENDED_OPENCART_INVALID_URL: String; // "Ugyldig url-parameter"
  CART_ADD_ERROR_EXTENDED_OPENCART_CURRENCY_MISMATCH: String; // "Kunne ikke tilf&oslash;je produktet/produkterne til indk&oslash;bskurven. Pr&..."
  CART_ADD_ERROR_EXTENDED_OPENCART_SETTING_DISABLED: String; // "Den funktionalitet, du fors&oslash;ger at bruge, er i &oslash;jeblikket ikke ..."
  CART_ACTION_ERROR_NOT_UP_TO_DATE: String; // "Kurven blev &aelig;ndret fra en anden enhed og er blevet opdateret. Pr&oslash..."
  CART_PROCEED: String; // "Til bestilling &gt;&gt;"
  CART_SHOW_ALL_PRODUCTS: String; // "Vis alle produkter"
  CART_PRICE_UNTIL_FREE_DELIVERY: String; // "K&oslash;b for $1 mere for at f&aring; fri fragt"
  CHECKOUT_HEADLINE: String; // "Bestilling"
  CHECKOUT_MENU: String; // "Til bestilling"
  CHECKOUT_LINK: String; // "bestilling"
  CHECKOUT_KLARNA_LINK: String; // "klarna-checkout"
  CHECKOUT_KLARNA_STEP_ONE: String; // "Ekstra information"
  CHECKOUT_TO_KLARNA_LINK_TEXT: String; // "Bestil med Klarna"
  CHECKOUT_FROM_KLARNA_LINK_TEXT: String; // "Bestil med anden betalingsmetode"
  CHECKOUT_RECIEPT: String; // "Kundeoplysninger"
  CHECKOUT_DELIVERY_ADRESS: String; // "Leveringsadresse"
  CHECKOUT_DELIVERY_ADDRESS: String; // "Leveringsadresse"
  CHECKOUT_DELIVERY_ADRESS_TEXT: String; // "Ja, ordren skal leveres til en anden adresse"
  CHECKOUT_DELIVERY_ADDRESS_TEXT: String; // "Ordren skal leveres til en anden adresse."
  CHECKOUT_MULTIPLE_DELIVERY_ADRESS_TEXT: String; // "Ja, ordren skal leveres til flere leveringsadresser"
  CHECKOUT_DELIVERY_ADRESS_NO: String; // "Pakken leveres til kundeadresse"
  CHECKOUT_DELIVERY_TO: String; // "Leveres til"
  CHECKOUT_STEP_ONE: String; // "Adresse"
  CHECKOUT_STEP_ONE_LOGGED_IN_TEXT: String; // "Du er logget ind, og nedenfor vises de informationer, som er tilknyttet din b..."
  CHECKOUT_STEP_ONE_ALREADY_CREATED: String; // "(Log ind ?)"
  CHECKOUT_EXISTING_USER: String; // "Eksisterende kunde? Log ind"
  CHECKOUT_STEP_ONE_LOG_OUT_TEXT: String; // "Hvis ovenst&aring;ende oplysninger ikke er korrekte, <a href="/actions/user/l..."
  CHECKOUT_STEP_ONE_PASSWORD_HEADLINE: String; // "Opret konto og gem informationer til n&aelig;ste gang?"
  CHECKOUT_STEP_ONE_PASSWORD_TEXT: String; // "Du kan spare tid n&aelig;ste gang du k&oslash;ber hos Bewise, hvis du gemmer ..."
  CHECKOUT_STEP_ONE_LOGGED_IN: String; // "Logget ind som"
  CHECKOUT_STEP_TWO: String; // "Forsendelse"
  CHECKOUT_STEP_THREE: String; // "Betaling"
  CHECKOUT_STEP_FOUR: String; // "Bekr&aelig;ftelse"
  CHECKOUT_STEP_FIVE: String; // "Afslut"
  CHECKOUT_COMPLETE: String; // "Din ordre er gennemf&oslash;rt"
  CHECKOUT_COMPLETE_NUMBER: String; // "Din ordre er gennemf&oslash;rt (Nr. #ORDER_NUMBER#)"
  CHECKOUT_COMPLETE_UPDATE: String; // "Din ordre er blevet opdateret"
  CHECKOUT_CART: String; // "Indk&oslash;bskurv"
  CHECKOUT_ALL_PRODUCTS: String; // "Alle produkter"
  CHECKOUT_DISCOUNT_CODE: String; // "Rabattkode"
  CHECKOUT_DISCOUNT_CODE_ERROR: String; // "Rabattkoden kunne ikke anvendes"
  CHECKOUT_DISCOUNT_CODE_OK: String; // "Rabattkoden er anvendt"
  CHECKOUT_DISCOUNT_CODE_NOT_FOUND: String; // "Rabattkoden blev ikke fundet"
  CHECKOUT_PAYMENT_METHOD: String; // "Betalingsmetode"
  CHECKOUT_PAYMENT_METHOD_KLARNA: String; // "Betal med Klarna"
  CHECKOUT_PAYMENT_METHOD_CREDITCARD: String; // "Betal med kreditkort"
  CHECKOUT_PAYMENT_METHOD_PAYPAL: String; // "Betal med PayPal"
  CHECKOUT_PAYMENT_METHOD_INVOICE: String; // "Betal med faktura"
  CHECKOUT_PAYMENT_METHOD_BANKTRANSFER: String; // "Betal med bankoverf&oslash;relse"
  CHECKOUT_PAYMENT_METHOD_CASH_ON_DELIVERY: String; // "Betal med kontant betaling ved levering"
  CHECKOUT_PAYMENT_METHOD_VOUCHER: String; // "Betal med gavekort"
  CHECKOUT_ORDER_NOT_FOUND: String; // "Din ordre kunne ikke findes"
  CHECKOUT_PAYMENT_METHOD_ERROR: String; // "Betalingen kunne ikke gennemf&oslash;res"
  CHECKOUT_PAYMENT_METHOD_TEXT: String; // "V&aelig;lg en betalingsmetode"
  CHECKOUT_PAYMENT_CONFIRM: String; // "Bekr&aelig;ft betalingen"
  CHECKOUT_PAYMENT_CONFIRM_KLARNA: String; // "Betal via Klarna"
  CHECKOUT_PAYMENT_KLARNA_TEXT: String; // "Klik p&aring; knappen for at afslutte din betaling via Klarna."
  CHECKOUT_PAYMENT_METHOD_SUMMARY: String; // "Betalingsmetode"
  CHECKOUT_PAYMENT_BANKTRANSFER_TEXT: String; // "Bankoverf&oslash;relse sker til følgende konto:"
  CHECKOUT_PAYMENT_BANKTRANSFER_TEXT_EXTRA: String; // "Inds&aelig;t venligst dit ordre nummer som reference"
  CHECKOUT_PAYMENT_CASH_ON_DELIVERY_TEXT: String; // "Betal kontant ved modtagelse af varer"
  CHECKOUT_PAYMENT_VOUCHER_TEXT: String; // "Indtast dit gavekortnummer her"
  CHECKOUT_CONFIRM_TEXT: String; // "Bekr&aelig;ft venligst din ordre"
  CHECKOUT_CONFIRM_TEXT_SUMMARY: String; // "Ordreoversigt"
  CHECKOUT_CONFIRM_TEXT_ORDER: String; // "Ordre"
  CHECKOUT_CONFIRM_TEXT_PRICE: String; // "Pris"
  CHECKOUT_CONFIRM_TEXT_DISCOUNT: String; // "Rabatter"
  CHECKOUT_CONFIRM_TEXT_TOTAL: String; // "Total"
  CHECKOUT_CONFIRM_TEXT_VAT: String; // "Moms"
  CHECKOUT_CONFIRM_TEXT_VAT_FREE: String; // "Momsfrit"
  CHECKOUT_CONFIRM_TEXT_SHIPPING: String; // "Forsendelse"
  CHECKOUT_CONFIRM_TEXT_PAYMENT: String; // "Betaling"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_KLARNA: String; // "Betal via Klarna"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_PAYPAL: String; // "Betal via PayPal"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_BANKTRANSFER: String; // "Betal via bankoverf&oslash;relse"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_CASH_ON_DELIVERY: String; // "Betal med kontant betaling ved levering"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_VOUCHER: String; // "Betal med gavekort"
  CHECKOUT_CONFIRM_TEXT_DELIVERY: String; // "Levering"
  CHECKOUT_CONFIRM_TEXT_ADRESS: String; // "Leveringsadresse"
  CHECKOUT_CONFIRM_TEXT_SUBTOTAL: String; // "Subtotal"
  CHECKOUT_CONFIRM_TEXT_SHIPPING_COSTS: String; // "Fragtomkostninger"
  CHECKOUT_CONFIRM_TEXT_DISCOUNT_CODE: String; // "Rabattkode"
  CHECKOUT_CONFIRM_TEXT_COUPON: String; // "Gavekort"
  CHECKOUT_CONFIRM_TEXT_PAYMENT_SUMMARY: String; // "Betalingsoversigt"
  CHECKOUT_CONFIRM_TEXT_ORDER_SUMMARY: String; // "Ordreoversigt"
  CHECKOUT_CONFIRM_TEXT_DELIVERY_ADDRESS: String; // "Leveringsadresse"
  CHECKOUT_CONFIRM_TEXT_BILLING_ADDRESS: String; // "Faktureringsadresse"
  CHECKOUT_CONFIRM_TEXT_BILLING: String; // "Fakturering"
  CHECKOUT_CONFIRM_TEXT_CASH_ON_DELIVERY: String; // "Betal med kontant betaling ved levering"
  CHECKOUT_CONFIRM_TEXT_METHOD: String; // "Betalingsmetode"
  CHECKOUT_CONFIRM_TEXT_TITLE: String; // "Ordreoversigt - #ORDER_NUMBER#"
  CHECKOUT_CONFIRM_TEXT_THANK_YOU: String; // "Tak for din ordre"
  ...

}`,
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Dandomain Smarty Tooltip</span>'
      );
    } else if (cleanVariableName.match(/^products(\[|\.|->|$)/)) {
      markdown.appendMarkdown(`**Collection: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Type:* `array<Product>` (guessed)\n');
      markdown.appendMarkdown('*Size:* Unknown (runtime)\n');
      markdown.appendCodeblock(
        '// Structure of each Product element:\ninterface Product {\n  id: number;\n  sku: string;\n  name: string;\n  price: number;\n  description?: string;\n}',
        'typescript'
      );
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>'
      );
    } else if (cleanVariableName.match(/^\$smarty\.*/)) {
      markdown.appendMarkdown(`**Reserved Variable: \`${variableName}\`**\n\n`);
      markdown.appendMarkdown(
        "Accesses Smarty's reserved variables (e.g., `$smarty.get`, `$smarty.const`, `$smarty.now`).\n"
      );
      markdown.appendMarkdown('Refer to Smarty documentation for details.');
    } else if (
      cleanVariableName.includes('.') ||
      cleanVariableName.includes('->') ||
      cleanVariableName.includes('[')
    ) {
      // Generisk gæt på property/method access eller array access
      markdown.appendMarkdown(
        `**Variable Access: \`${cleanVariableName}\`**\n\n`
      );
      markdown.appendMarkdown('*Type:* Unknown (Requires analysis)\n');
      markdown.appendMarkdown('*Value:* Unknown (Runtime)\n');
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>'
      );
    } else {
      // Simpel variabel
      markdown.appendMarkdown(`**Variable: \`${cleanVariableName}\`**\n\n`);
      markdown.appendMarkdown('*Type:* Unknown (Requires analysis)\n');
      markdown.appendMarkdown('*Value:* Unknown (Runtime)\n');
      markdown.appendMarkdown('\n---\n');
      markdown.appendMarkdown(
        '<span style="color:gray;">Simulated data - Requires PHP analysis for real info.</span>'
      );
    }

    // --- SIMULERET LOGIK SLUT ---

    if (markdown.value) {
      // Check if markdown has content before creating Hover
      // Returner et Hover objekt med indholdet og det område, det dækker
      return new vscode.Hover(markdown, wordRange);
    }

    return undefined; // Returner intet hvis ingen information blev genereret
  }
}

// Denne funktion kaldes kun én gang, når din extension aktiveres
export function activate(context: vscode.ExtensionContext) {
  console.log('Activating Smarty Peek extension...');

  // Opret en instans af vores Hover Provider
  const smartyHoverProvider = new SmartyHoverProvider();

  // Registrer Hover Provider for 'smarty' sproget.
  // Resultatet (en 'Disposable') tilføjes til context.subscriptions,
  // så det automatisk ryddes op, når extensionen deaktiveres.
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      // Selector: Matcher filer med sproget 'smarty'
      { language: 'smarty', scheme: 'file' }, // Vær specifik om scheme for at undgå f.eks. settings-filer
      smartyHoverProvider
    )
  );

  // Eksempel på registrering af en kommando (hvis du tilføjer en i package.json)
  /*
    context.subscriptions.push(
        vscode.commands.registerCommand('smarty-peek.showInfo', () => {
            vscode.window.showInformationMessage('Smarty Peek: Showing information! (Not implemented yet)');
        })
    );
    */

  console.log('Smarty Peek extension activated successfully.');
}

// Denne funktion kaldes, når din extension deaktiveres (f.eks. når VS Code lukkes)
export function deactivate() {
  console.log('Deactivating Smarty Peek extension.');
  // Ressourcer tilføjet til context.subscriptions i activate() bliver automatisk ryddet op.
}

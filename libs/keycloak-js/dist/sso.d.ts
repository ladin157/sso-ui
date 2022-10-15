/*
 * MIT License
 *
 * Copyright 2017 Brett Epps <https://github.com/eppsilon>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export type SsoOnLoad = 'login-required'|'check-sso';
export type SsoResponseMode = 'query'|'fragment';
export type SsoResponseType = 'code'|'id_token token'|'code id_token token';
export type SsoFlow = 'standard'|'implicit'|'hybrid';
export type SsoPkceMethod = 'S256';

export interface SsoConfig {
	/**
	 * URL to the Sso server, for example: http://sso-server/auth
	 */
	url?: string;
	/**
	 * Name of the realm, for example: 'myrealm'
	 */
	realm: string;
	/**
	 * Client identifier, example: 'myapp'
	 */
	clientId: string;
}

export interface Acr {
	/**
	 * Array of values, which will be used inside ID Token `acr` claim sent inside the `claims` parameter to Sso server during login.
	 * Values should correspond to the ACR levels defined in the ACR to Loa mapping for realm or client or to the numbers (levels) inside defined
	 * Sso authentication flow. See section 5.5.1 of OIDC 1.0 specification for the details.
	 */
	values: string[];
	/**
	 * This parameter specifies if ACR claims is considered essential or not.
	 */
	essential: boolean;
}

export interface SsoInitOptions {
	/**
	 * Adds a [cryptographic nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce)
	 * to verify that the authentication response matches the request.
	 * @default true
	 */
	useNonce?: boolean;

	/**
	 * 
	 * Allow usage of different types of adapters or a custom adapter to make Sso work in different environments.
	 *
	 * The following options are supported:
	 * - `default` - Use default APIs that are available in browsers.
	 * - `cordova` - Use a WebView in Cordova.
	 * - `cordova-native` - Use Cordova native APIs, this is recommended over `cordova`.
	 *
	 * It's also possible to pass in a custom adapter for the environment you are running Sso in. In order to do so extend the `SsoAdapter` interface and implement the methods that are defined there.
	 *
	 * For example:
	 *
	 * ```ts
	 * import Sso, { SsoAdapter } from 'sso-js';
	 *
	 * // Implement the 'SsoAdapter' interface so that all required methods are guaranteed to be present.
	 * const MyCustomAdapter: SsoAdapter = {
	 * 	login(options) {
	 * 		// Write your own implementation here.
	 * 	}
	 *
	 * 	// The other methods go here...
	 * };
	 *
	 * const sso = new Sso();
	 *
	 * sso.init({
	 * 	adapter: MyCustomAdapter,
	 * });
	 * ```
	 */
	adapter?: 'default' | 'cordova' | 'cordova-native' | SsoAdapter;
	
	/**
	 * Specifies an action to do on load.
	 */
	onLoad?: SsoOnLoad;

	/**
	 * Set an initial value for the token.
	 */
	token?: string;

	/**
	 * Set an initial value for the refresh token.
	 */
	refreshToken?: string;

	/**
	 * Set an initial value for the id token (only together with `token` or
	 * `refreshToken`).
	 */
	idToken?: string;

	/**
	 * Set an initial value for skew between local time and Sso server in
	 * seconds (only together with `token` or `refreshToken`).
	 */
	timeSkew?: number;

	/**
	 * Set to enable/disable monitoring login state.
	 * @default true
	 */
	checkLoginIframe?: boolean;

	/**
	 * Set the interval to check login state (in seconds).
	 * @default 5
	 */
	checkLoginIframeInterval?: number;

	/**
	 * Set the OpenID Connect response mode to send to Sso upon login.
	 * @default fragment After successful authentication Sso will redirect
	 *                   to JavaScript application with OpenID Connect parameters
	 *                   added in URL fragment. This is generally safer and
	 *                   recommended over query.
	 */
	responseMode?: SsoResponseMode;

	/**
	 * Specifies a default uri to redirect to after login or logout.
	 * This is currently supported for adapter 'cordova-native' and 'default'
	 */
	redirectUri?: string;

	/**
	 * Specifies an uri to redirect to after silent check-sso.
	 * Silent check-sso will only happen, when this redirect uri is given and
	 * the specified uri is available within the application.
	 */
	silentCheckSsoRedirectUri?: string;

	/**
	 * Specifies whether the silent check-sso should fallback to "non-silent"
	 * check-sso when 3rd party cookies are blocked by the browser. Defaults
	 * to true.
	 */
	silentCheckSsoFallback?: boolean;

	/**
	 * Set the OpenID Connect flow.
	 * @default standard
	 */
	flow?: SsoFlow;

	/**
	 * Configures the Proof Key for Code Exchange (PKCE) method to use.
	 * The currently allowed method is 'S256'.
	 * If not configured, PKCE will not be used.
	 */
	pkceMethod?: SsoPkceMethod;

	/**
	 * Enables logging messages from Sso to the console.
	 * @default false
	 */
	enableLogging?: boolean

	/**
	 * Set the default scope parameter to the login endpoint. Use a space-delimited list of scopes. 
	 * Note that the scope 'openid' will be always be added to the list of scopes by the adapter.
	 * Note that the default scope specified here is overwritten if the `login()` options specify scope explicitly.
	 */
	scope?: string
	
	/**
	 * Configures how long will Sso adapter wait for receiving messages from server in ms. This is used,
	 * for example, when waiting for response of 3rd party cookies check.
	 *
	 * @default 10000
	 */
	messageReceiveTimeout?: number
}

export interface SsoLoginOptions {
	/**
	 * Specifies the scope parameter for the login url
	 * The scope 'openid' will be added to the scope if it is missing or undefined.
	 */
	scope?: string;

	/**
	 * Specifies the uri to redirect to after login.
	 */
	redirectUri?: string;

	/**
	 * By default the login screen is displayed if the user is not logged into
	 * Sso. To only authenticate to the application if the user is already
	 * logged in and not display the login page if the user is not logged in, set
	 * this option to `'none'`. To always require re-authentication and ignore
	 * SSO, set this option to `'login'`.
	 */
	prompt?: 'none'|'login';

	/**
	 * If value is `'register'` then user is redirected to registration page,
	 * otherwise to login page.
	 */
	action?: string;

	/**
	 * Used just if user is already authenticated. Specifies maximum time since
	 * the authentication of user happened. If user is already authenticated for
	 * longer time than `'maxAge'`, the SSO is ignored and he will need to
	 * authenticate again.
	 */
	maxAge?: number;

	/**
	 * Used to pre-fill the username/email field on the login form.
	 */
	loginHint?: string;

	/**
	 * Sets the `acr` claim of the ID token sent inside the `claims` parameter. See section 5.5.1 of the OIDC 1.0 specification.
	 */
	acr?: Acr;

	/**
	 * Used to tell Sso which IDP the user wants to authenticate with.
	 */
	idpHint?: string;

				/**
	 * Sets the 'ui_locales' query param in compliance with section 3.1.2.1
							 * of the OIDC 1.0 specification.
	 */
	locale?: string;

	/**
	 * Specifies arguments that are passed to the Cordova in-app-browser (if applicable).
	 * Options 'hidden' and 'location' are not affected by these arguments.
	 * All available options are defined at https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/.
	 * Example of use: { zoom: "no", hardwareback: "yes" }
	 */
	cordovaOptions?: { [optionName: string]: string };
}

export interface SsoLogoutOptions {
	/**
	 * Specifies the uri to redirect to after logout.
	 */
	redirectUri?: string;
}

export interface SsoRegisterOptions extends Omit<SsoLoginOptions, 'action'> { }

export interface SsoAccountOptions {
	/**
	 * Specifies the uri to redirect to when redirecting back to the application.
	 */
	redirectUri?: string;	
}

export type SsoPromiseCallback<T> = (result: T) => void;

export interface SsoPromise<TSuccess, TError> extends Promise<TSuccess> {
	/**
	 * Function to call if the promised action succeeds.
	 * 
	 * @deprecated Use `.then()` instead.
	 */
	success(callback: SsoPromiseCallback<TSuccess>): SsoPromise<TSuccess, TError>;

	/**
	 * Function to call if the promised action throws an error.
	 * 
	 * @deprecated Use `.catch()` instead.
	 */
	error(callback: SsoPromiseCallback<TError>): SsoPromise<TSuccess, TError>;
}

export interface SsoError {
	error: string;
	error_description: string;
}

export interface SsoAdapter {
	login(options?: SsoLoginOptions): SsoPromise<void, void>;
	logout(options?: SsoLogoutOptions): SsoPromise<void, void>;
	register(options?: SsoRegisterOptions): SsoPromise<void, void>;
	accountManagement(): SsoPromise<void, void>;
	redirectUri(options: { redirectUri: string; }, encodeHash: boolean): string;
}

export interface SsoProfile {
	id?: string;
	username?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	enabled?: boolean;
	emailVerified?: boolean;
	totp?: boolean;
	createdTimestamp?: number;
}

export interface SsoTokenParsed {
	iss?: string;
	sub?: string;
	aud?: string;
	exp?: number;
	iat?: number;
	auth_time?: number;
	nonce?: string;
	acr?: string;
	amr?: string;
	azp?: string;
	session_state?: string;
	realm_access?: SsoRoles;
	resource_access?: SsoResourceAccess;
	[key: string]: any; // Add other attributes here.
}

export interface SsoResourceAccess {
	[key: string]: SsoRoles
}

export interface SsoRoles {
	roles: string[];
}

/**
 * @deprecated Instead of importing 'SsoInstance' you can import 'Sso' directly as a type.
 */
export type SsoInstance = Sso;

/**
 * @deprecated Construct a Sso instance using the `new` keyword instead.
 */
declare function Sso(config?: SsoConfig | string): Sso;

/**
 * A client for the Sso authentication server.
 * @see {@link https://sso.gitbooks.io/securing-client-applications-guide/content/topics/oidc/javascript-adapter.html|Sso JS adapter documentation}
 */
declare class Sso {
	/**
	 * Creates a new Sso client instance.
	 * @param config A configuration object or path to a JSON config file.
	 */
	constructor(config?: SsoConfig | string)

	/**
	 * Is true if the user is authenticated, false otherwise.
	 */
	authenticated?: boolean;

	/**
	* The user id.
	*/
	subject?: string;

	/**
	* Response mode passed in init (default value is `'fragment'`).
	*/
	responseMode?: SsoResponseMode;

	/**
	* Response type sent to Sso with login requests. This is determined
	* based on the flow value used during initialization, but can be overridden
	* by setting this value.
	*/
	responseType?: SsoResponseType;

	/**
	* Flow passed in init.
	*/
	flow?: SsoFlow;

	/**
	* The realm roles associated with the token.
	*/
	realmAccess?: SsoRoles;

	/**
	* The resource roles associated with the token.
	*/
	resourceAccess?: SsoResourceAccess;

	/**
	* The base64 encoded token that can be sent in the Authorization header in
	* requests to services.
	*/
	token?: string;

	/**
	* The parsed token as a JavaScript object.
	*/
	tokenParsed?: SsoTokenParsed;

	/**
	* The base64 encoded refresh token that can be used to retrieve a new token.
	*/
	refreshToken?: string;

	/**
	* The parsed refresh token as a JavaScript object.
	*/
	refreshTokenParsed?: SsoTokenParsed;

	/**
	* The base64 encoded ID token.
	*/
	idToken?: string;

	/**
	* The parsed id token as a JavaScript object.
	*/
	idTokenParsed?: SsoTokenParsed;

	/**
	* The estimated time difference between the browser time and the Sso
	* server in seconds. This value is just an estimation, but is accurate
	* enough when determining if a token is expired or not.
	*/
	timeSkew?: number;

	/**
	* @private Undocumented.
	*/
	loginRequired?: boolean;

	/**
	* @private Undocumented.
	*/
	authServerUrl?: string;

	/**
	* @private Undocumented.
	*/
	realm?: string;

	/**
	* @private Undocumented.
	*/
	clientId?: string;

	/**
	* @private Undocumented.
	*/
	clientSecret?: string;

	/**
	* @private Undocumented.
	*/
	redirectUri?: string;

	/**
	* @private Undocumented.
	*/
	sessionId?: string;

	/**
	* @private Undocumented.
	*/
	profile?: SsoProfile;

	/**
	* @private Undocumented.
	*/
	userInfo?: {}; // SsoUserInfo;

	/**
	* Called when the adapter is initialized.
	*/
	onReady?(authenticated?: boolean): void;

	/**
	* Called when a user is successfully authenticated.
	*/
	onAuthSuccess?(): void;

	/**
	* Called if there was an error during authentication.
	*/
	onAuthError?(errorData: SsoError): void;

	/**
	* Called when the token is refreshed.
	*/
	onAuthRefreshSuccess?(): void;

	/**
	* Called if there was an error while trying to refresh the token.
	*/
	onAuthRefreshError?(): void;

	/**
	* Called if the user is logged out (will only be called if the session
	* status iframe is enabled, or in Cordova mode).
	*/
	onAuthLogout?(): void;

	/**
	* Called when the access token is expired. If a refresh token is available
	* the token can be refreshed with Sso#updateToken, or in cases where
	* it's not (ie. with implicit flow) you can redirect to login screen to
	* obtain a new access token.
	*/
	onTokenExpired?(): void;

	/**
	* Called when a AIA has been requested by the application.
	*/
	onActionUpdate?(status: 'success'|'cancelled'|'error'): void;

	/**
	* Called to initialize the adapter.
	* @param initOptions Initialization options.
	* @returns A promise to set functions to be invoked on success or error.
	*/
	init(initOptions: SsoInitOptions): SsoPromise<boolean, SsoError>;

	/**
	* Redirects to login form.
	* @param options Login options.
	*/
	login(options?: SsoLoginOptions): SsoPromise<void, void>;

	/**
	* Redirects to logout.
	* @param options Logout options.
	*/
	logout(options?: SsoLogoutOptions): SsoPromise<void, void>;

	/**
	* Redirects to registration form.
	* @param options The options used for the registration.
	*/
	register(options?: SsoRegisterOptions): SsoPromise<void, void>;

	/**
	* Redirects to the Account Management Console.
	*/
	accountManagement(): SsoPromise<void, void>;

	/**
	* Returns the URL to login form.
	* @param options Supports same options as Sso#login.
	*/
	createLoginUrl(options?: SsoLoginOptions): string;

	/**
	* Returns the URL to logout the user.
	* @param options Logout options.
	*/
	createLogoutUrl(options?: SsoLogoutOptions): string;

	/**
	* Returns the URL to registration page.
	* @param options The options used for creating the registration URL.
	*/
	createRegisterUrl(options?: SsoRegisterOptions): string;

	/**
	* Returns the URL to the Account Management Console.
	* @param options The options used for creating the account URL.
	*/
	createAccountUrl(options?: SsoAccountOptions): string;

	/**
	* Returns true if the token has less than `minValidity` seconds left before
	* it expires.
	* @param minValidity If not specified, `0` is used.
	*/
	isTokenExpired(minValidity?: number): boolean;

	/**
	* If the token expires within `minValidity` seconds, the token is refreshed.
	* If the session status iframe is enabled, the session status is also
	* checked.
	* @returns A promise to set functions that can be invoked if the token is
	*          still valid, or if the token is no longer valid.
	* @example
	* ```js
	* sso.updateToken(5).then(function(refreshed) {
	*   if (refreshed) {
	*     alert('Token was successfully refreshed');
	*   } else {
	*     alert('Token is still valid');
	*   }
	* }).catch(function() {
	*   alert('Failed to refresh the token, or the session has expired');
	* });
	*/
	updateToken(minValidity: number): SsoPromise<boolean, boolean>;

	/**
	* Clears authentication state, including tokens. This can be useful if
	* the application has detected the session was expired, for example if
	* updating token fails. Invoking this results in Sso#onAuthLogout
	* callback listener being invoked.
	*/
	clearToken(): void;

	/**
	* Returns true if the token has the given realm role.
	* @param role A realm role name.
	*/
	hasRealmRole(role: string): boolean;

	/**
	* Returns true if the token has the given role for the resource.
	* @param role A role name.
	* @param resource If not specified, `clientId` is used.
	*/
	hasResourceRole(role: string, resource?: string): boolean;

	/**
	* Loads the user's profile.
	* @returns A promise to set functions to be invoked on success or error.
	*/
	loadUserProfile(): SsoPromise<SsoProfile, void>;

	/**
	* @private Undocumented.
	*/
	loadUserInfo(): SsoPromise<{}, void>;
}

export default Sso;

/**
 * @deprecated The 'Sso' namespace is deprecated, use named imports instead.
 */
export as namespace Sso;

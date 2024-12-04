<?php
/**
 * Custom phpMyAdmin configuration
 */

// Show git revision if available
$cfg['ShowGitRevision'] = false;

// Show server as hostname+port
$cfg['ShowServerInfo'] = false;

// Show PHP info link
$cfg['ShowPhpInfo'] = false;

// Show charsetnr column in data dictionary
$cfg['ShowColumnComments'] = true;

// Default server
$cfg['Servers'][1]['auth_type'] = 'cookie';
$cfg['Servers'][1]['AllowNoPassword'] = false;
$cfg['Servers'][1]['AllowRoot'] = false;
$cfg['Servers'][1]['SignonSession'] = 'SignonSession';
$cfg['Servers'][1]['LogoutURL'] = '/phpmyadmin/logout';

// Interface settings
$cfg['RememberSorting'] = true;
$cfg['ShowBrowseComments'] = true;
$cfg['ShowPropertyComments'] = true;
$cfg['QueryHistoryMax'] = 100;
$cfg['RetainQueryBox'] = true;
$cfg['CodemirrorEnable'] = true;
$cfg['DefaultLang'] = 'es';
$cfg['DefaultConnectionCollation'] = 'utf8mb4_unicode_ci';

// Navigation settings
$cfg['NavigationTreeEnableGrouping'] = true;
$cfg['NavigationTreeDisplayItemFilterMinimum'] = 30;
$cfg['NavigationTreeDisplayDbFilterMinimum'] = 30;
$cfg['NavigationTreeEnableExpansion'] = true;

// Export/Import settings
$cfg['Export']['method'] = 'custom';
$cfg['Import']['charset'] = 'utf-8';
$cfg['Export']['charset'] = 'utf-8';
$cfg['Export']['compression'] = 'gzip';
$cfg['ZipDump'] = true;
$cfg['GZipDump'] = true;

// Console settings
$cfg['ConsoleEnterExecutes'] = true;
$cfg['Console']['DarkTheme'] = false;

// Security settings
$cfg['CheckConfigurationPermissions'] = false;
$cfg['AllowUserDropDatabase'] = false;
$cfg['AllowArbitraryServer'] = false;
$cfg['LoginCookieValidity'] = 1440;
$cfg['LoginCookieStore'] = 0;
$cfg['LoginCookieDeleteAll'] = true;
$cfg['VersionCheck'] = false;

// Theme settings
$cfg['ThemeDefault'] = 'pmahomme';
$cfg['ThemeManager'] = true;

// Other settings
$cfg['MaxRows'] = 100;
$cfg['SendErrorReports'] = 'never';
$cfg['ShowDatabasesNavigationAsTree'] = true;
$cfg['ShowTooltip'] = true;
$cfg['RowActionLinks'] = 'both';
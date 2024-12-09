<?php
/**
 * Custom phpMyAdmin configuration
 */

// Server configuration
$cfg['Servers'][1]['host'] = 'db';
$cfg['Servers'][1]['port'] = '3306';
$cfg['Servers'][1]['user'] = 'innovation_user';
$cfg['Servers'][1]['password'] = 'Prod2024Secure!';
$cfg['Servers'][1]['AllowNoPassword'] = false;
$cfg['Servers'][1]['AllowRoot'] = false;
$cfg['Servers'][1]['compress'] = false;
$cfg['Servers'][1]['controluser'] = 'innovation_user';
$cfg['Servers'][1]['controlpass'] = 'Prod2024Secure!';

// Interface settings
$cfg['ShowDatabasesNavigationAsTree'] = true;
$cfg['MaxNavigationItems'] = 250;
$cfg['NavigationTreeEnableGrouping'] = true;
$cfg['ShowPropertyComments'] = true;

// Display settings
$cfg['MaxRows'] = 50;
$cfg['DefaultLang'] = 'es';
$cfg['DefaultConnectionCollation'] = 'utf8mb4_unicode_ci';

// Export/Import settings
$cfg['Export']['method'] = 'custom';
$cfg['Import']['charset'] = 'utf8';
$cfg['Export']['charset'] = 'utf8';
$cfg['Export']['compression'] = 'gzip';

// Security settings
$cfg['LoginCookieValidity'] = 1440;
$cfg['LoginCookieStore'] = 0;
$cfg['LoginCookieDeleteAll'] = true;
$cfg['VersionCheck'] = false;

// Theme settings
$cfg['ThemeDefault'] = 'pmahomme';
$cfg['ThemeManager'] = true;

// Console settings
$cfg['ConsoleEnterExecutes'] = true;
$cfg['Console']['DarkTheme'] = false;
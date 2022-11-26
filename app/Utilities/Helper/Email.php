<?php
/**
 * Prepare email.
 *
 * @package Mint\MRM\Utilites\Helper
 * @namespace Mint\MRM\Utilites\Helper
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\Utilites\Helper;

/**
 * Email class
 *
 * Prepare email.
 *
 * @package Mint\MRM\Utilites\Helper
 * @namespace Mint\MRM\Utilites\Helper
 *
 * @version 1.0.0
 */
class Email {

	/**
	 * Prepare email header information
	 *
	 * @param array $existing_header previous email header.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_mail_header( $existing_header = array() ) {
		if ( ! empty( $existing_header['From'] ) ) {
			return $existing_header;
		}

		$headers = array(
			'MIME-Version: 1.0',
			'Content-type: text/html;charset=UTF-8',
		);
		static $global_headers;
		if ( $global_headers ) {
			return $global_headers;
		}

		// Get email settings from the options table.
		$global_email_settings = get_option( '_mrm_email_settings' );

		// Prepare sender information.
		$from_name  = isset( $global_email_settings['from_name'] ) ? $global_email_settings['from_name'] : '';
		$from_email = isset( $global_email_settings['from_email'] ) ? $global_email_settings['from_email'] : '';

		if ( $from_name && $from_email ) {
			$headers[] = 'From: ' . $from_name . ' <' . $from_email . '>';
		} elseif ( $from_email ) {
			$headers[] = $from_email;
		}

		// Prepare replay to information.
		$reply_name  = isset( $global_email_settings['reply_name'] ) ? $global_email_settings['reply_name'] : '';
		$reply_email = isset( $global_email_settings['from_name'] ) ? $global_email_settings['reply_email'] : '';

		if ( $reply_name && $reply_email ) {
			$headers[] = 'Reply-To: ' . $reply_name . ' <' . $reply_email . '>';
		} elseif ( $reply_email ) {
			$headers[] = $reply_email;
		}

		$global_headers = $headers;
		return $global_headers;
	}
	/**
	 * Prepare email template information
	 *
	 * @param string $email_body email body.
	 * @param string $domain_link domain link.
	 * @param int    $contact_id contact id.
	 * @param string $hash contact hash key.
	 */
	public static function get_mail_template( $email_body = '', $domain_link, $contact_id, $hash ) {
		return "
            <!DOCTYPE html>
            <html lang='en-US'>
                <head>
                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
                    <!--[if gte mso 15]>
                    <xml>
                    <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <link rel='profile' href='https://gmpg.org/xfn/11'>
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>

                    <style type='text/css'>@media only screen and (max-width: 480px) {
                            body, table, td, p, a, li, blockquote {
                                -webkit-text-size-adjust: none !important;
                            }
                            #bodyCell {
                                padding: 0px !important;
                            }
                            .fcTextBlockInner {
                                padding-top: 0px !important;
                            }
                            .mcnTextBlockOuter .fc_email_body {
                                padding-top: 10px !important;
                                padding-right: 10px !important;
                                padding-bottom: 10px !important;
                                padding-left: 10px !important;
                            }
                            .fc_column_content {
                                padding: 0;
                            }
                            table.fc_media_table {
                                width: 100% !important;
                                display: block;
                            }
                            table.fc_media_text {
                                width: 100% !important;
                                display: block;
                            }
                            .wp-block-media-text__media {
                                background-image: none !important;
                            }
                            .wp-block-media-text__media img {
                                opacity: 1 !important;
                            }
                            table.fce_buttons_row {
                                margin-bottom: 10px;
                            }
                            table.fce_buttons_row .fce_column {
                                margin-bottom: 10px;
                                margin-top: 10px;
                                text-align: center;
                            }
                        }@media only screen and (max-width: 480px) {
                            body {
                                width: 100% !important;
                                min-width: 100% !important;
                            }
                        }@media only screen and (max-width: 480px) {
                            .fcTextContentContainer {
                                max-width: 100% !important;
                                width: 100% !important;
                            }
                        }@media only screen and (max-width: 480px) {
                            h2 {
                                font-size: 20px !important;
                                line-height: 125% !important;
                            }
                        }
                    </style>
                </head>
                <body style='background: none no-repeat center/cover; background-color: #FAFAFA; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; font-family: Helvetica; height: 100%; margin: 0; padding: 0; width: 100%; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover;'>
                    <center>
                        <table id='templateWrapper' align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #FAFAFA; background-color: #FAFAFA; height: 100%; margin: 0; padding: 0; width: 100%; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; color: inherit;'>
                            <tr>
                                <td align='center' valign='top' id='bodyCell' style='mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding: 10px; border-top: 0; height: 100%; margin: 0; width: 100%;'>
                                    <!-- BEGIN TEMPLATE // -->
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;color:inherit;'>
                                    <tr>
                                        <td align='center' valign='top' width='600' style='width:600px;'>
                                    <![endif]-->
                                    <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer' style='border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width: 700px; border: 0; color: inherit;'>
                                        <tr>
                                            <td valign='top' id='templateBody' style='mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-top: 0; border-bottom: 0;'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='fcTextBlock' style='border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; min-width: 100%; color: inherit;'>
                                                    <tbody class='fcTextBlockOuter'>
                                                    <tr>
                                                        <td valign='top' class='fcTextBlockInner' style='mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 9px;'>
                                                            <!--[if mso]>
                                                            <table align='left' border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100%;color:inherit;'>
                                                            <tr>
                                                            <![endif]-->

                                                            <!--[if mso]>
                                                            <td valign='top' width='600' style='width:600px;'>
                                                            <![endif]-->
                                                            <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' class='fcTextContentContainer' style='border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width: 100%; min-width: 100%; color: inherit;'>
                                                                <tbody>
                                                                <tr>
                                                                    <td valign='top' class='fcTextContentBody' style='mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #FFFFFF none no-repeat center/cover; background-color: #FFFFFF; color: #202020; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; padding-top: 0; padding-bottom: 9px;'>
                                                                        <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' class='fcTextContentContainer' style='border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width: 100%; min-width: 100%; color: inherit;'>
                                                                            <tbody class='mcnTextBlockOuter'>
                                                                            <tr>
                                                                                <td class='fc_email_body' align='left' valign='top' style='mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 10px; padding-left: 20px; word-break: break-word; font-size: 16px; line-height: 180%; text-align: left;'>" . $email_body . "</td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                    </table>
                                                            <!--[if mso]>
                                                            </td>
                                                            <![endif]-->
                                                            <!--[if mso]>
                                                            </tr>
                                                            </table>
                                                            <![endif]-->
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table></td>
                                        </tr>
                                                        </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                    <!-- // END TEMPLATE -->
                                </td>
                            </tr>
                        </table>
                        <a href='" . $domain_link . '/?mrm=1&amp;route=unsubscribe&amp;contact_id=' . $contact_id . '&amp;hash=' . $hash . "'>Unsubcribe</a>
                    </center>
                </body>
            </html>
        ";
	}

}

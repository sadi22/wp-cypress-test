<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); //phpcs:ignore ?>>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
	<meta http-equiv="Imagetoolbar" content="No"/>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php esc_html_e( 'Email Confirmation', 'mrm' ); ?></title>
	<?php
		wp_head();
	?>
</head>

<body>
<div class="mrm_wrapper" style="margin: 0 auto;
	max-width: 600px;
	padding: 0px 0px 1px;background: #eddfdf;
	text-align: center;">
	<div class="mrm_title">
		<h3>Mint Mail</h3>
	</div>
	<div class="mrm_form_wrapper">
	<?php
		/**
		 * Confirmation message printing.
		 *
		 * @package Mint\MRM\Resources\
		 * @author [MRM Team]
		 */

	 	echo $confirmation_message ; //phpcs:ignore
	?>
	</div>
</div>
<?php
	wp_footer();
?>
</body>
</html>

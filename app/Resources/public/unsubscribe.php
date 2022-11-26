<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); //phpcs:ignore ?>>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
	<meta http-equiv="Imagetoolbar" content="No"/>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php esc_html_e( 'Unsubscribe', 'mrm' ); ?></title>
</head>
<body>
<div class="mrm_unsubscribe_wrapper">
	<div class="mrm_un_form_wrapper" style="background-color: #fff;
	border-radius: 6px;
	color: #333;
	font-size: 14px;
	line-height: 150%;
	padding: 20px;">
		<h3>Unsubscribe</h3>
		<p>We're sorry to see you go! Enter your email address to unsubscribe from this list.</p>
		<form id="mrm_unsubscribe_form" class="mrm_public_pref_form">
			<div class="mrm_form_item">
				<label>Your Email Address</label>
				<input readonly="true" value="<?php echo $mask_email; //phpcs:ignore ?>" class="mrm_form_control" type="text" name="email_address" />
			</div>
			<div class="mrm_form_item">
				<input id="mrm_unsubscribe_submit" type="submit" value="Unsubcribe"></input>
			</div>
		</form>
		<div class="mrm_form_responses"></div>
	</div>
</div>

</body>
</html>

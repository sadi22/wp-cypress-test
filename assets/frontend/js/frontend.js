jQuery(document).ready(function($){
    /**
     * Shortcode form submission ajax
     */
    $('.mrm-form-wrapper form').on('submit', function (e) {
        e.preventDefault();
        jQuery(".response").html('')
        $(".mrm-submit-button").addClass("show-loader");
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : MRM_Frontend_Vars.ajaxurl,
            data : {action: "mrm_submit_form" , post_data : jQuery("#mrm-form").serialize(), security : MRM_Frontend_Vars.mrm_form_nonce},
            success: function(response) {
                if (response.status == "success"){
                    jQuery(".response").addClass('mintmrm-success')
                    $(".mrm-submit-button").removeClass("show-loader");
                    if (response.confirmation_type == 'same_page'){
                        if(response.after_form_submission == 'hide_form'){
                            $(".mrm-form-wrapper form").hide();
                        }else if(response.after_form_submission == 'reset_form'){
                           $("#mrm-form")[0].reset();
                        }
                    }
                    if(response.confirmation_type == 'to_a_page'){
                        if(response.redirect_page){
                            setTimeout(function (){
                                window.location.href = response.redirect_page
                            },2000)
                        }else{
                            setTimeout(function (){
                                jQuery(".response").html("Redirect URL not found")
                            },2000)
                        }
                    }
                    if(response.confirmation_type == 'to_a_custom_url'){
                        if(response.custom_url != ''){
                            setTimeout(function (){
                                window.location.href = response.custom_url
                            },1000)
                        }
                    }

                    jQuery(".response").html(response.message)

                }else if(response.status == "failed"){
                    jQuery(".response").addClass('mintmrm-error')
                    jQuery(".response").html(response.message)

                }
            }
        })
    })

    /**
     * Set cokokie
     * @param name
     * @param value
     * @param daysToLive
     */
    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();

        var value = {show: cValue, expire: date.getTime()};

        document.cookie = cName + "=" + JSON.stringify(value) + "; " + expires + "; path=/";
    }
    /**
     * Form Close button Function
     */

    $(".mrm-form-close").on("click",function(){
        var cookies_time = MRM_Frontend_Vars.form_cookies_time;
        setCookie('mrm_form_dismissed',true, cookies_time);
        $(this).parent().parent().hide()

    })
});
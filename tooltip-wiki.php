<?php
/*
Plugin Name: Tooltip Wiki - ABM
Version: 1.0.0
*/
class Tooltip_Wiki {

    public function __construct() {

        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'wp_ajax_nopriv_tooltip_action', array( $this, 'ajax_action' ) );
        add_action( 'wp_ajax_tooltip_action', array( $this, 'ajax_action' ) );

    }

    public function enqueue_scripts() {

        wp_register_script( 'tooltip-ajax-script', plugins_url( 'tooltip-wiki.js', __FILE__ ), array(), false, true );
        wp_localize_script( 'tooltip-ajax-script', 'readmelater_ajax', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce' => wp_create_nonce( 'adielnonce' )
          ) );

        wp_enqueue_script( 'tooltip-ajax-script' );

        wp_enqueue_style( 'tooltip-wiki-style', plugins_url( 'tooltip-wiki.css', __FILE__ ) );
    
     } 



     public function ajax_action() {
        

        // Check wp_create_nonce:
        check_ajax_referer( 'adielnonce', 'nonce' );


        // Get Post URL:
        $post_url = $_POST['post_url'];

        $post_url_path = parse_url($post_url)['path'];

        $post_url_path = str_replace('/', '', $post_url_path);
        $post_url_path = str_replace('wordpress', '', $post_url_path);




        // Get Post OBJECT Using Slug:
        $post = get_page_by_path($post_url_path, OBJECT, 'post');

        // Get Post Contect Using Post OBJECT:
        $post_contect = get_the_content(null, false, $post);
        $post_title = get_the_title($post);
        $post_parmalink = get_the_permalink($post);
        $post_img = get_the_post_thumbnail_url($post);


        /*   ======= AJAX OUTPUT ======= */ 

        $return = array(
            'post_contect' => mb_strimwidth($post_contect, 0, 200),
            'post_title' => $post_title,
            'post_img' => $post_img,
            'post_parmalink' => $post_parmalink

        );
        wp_send_json_success( $return );


    } 


}

new Tooltip_Wiki;
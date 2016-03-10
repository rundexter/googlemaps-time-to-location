var _ = require('lodash'),
    GoogleMapsAPI = require('googlemaps'),
    util = require('./util.js');


module.exports = {

    /**
     * Get auth data.
     *
     * @param step
     * @param dexter
     * @returns {*}
     */
    authOptions: function (step, dexter) {
        var authData = {};
        var credentials = dexter.provider( 'google' ).credentials();

        if ( credentials.server_key ) {
            authData.key = credentials.server_key;
        } else if ( credentials.google_client_id && credentials.google_private_key) {
            authData.google_client_id = credentials.google_client_id;
            authData.google_private_key = credentials.google_private_key;
        }

        return _.isEmpty(authData)? false : authData;
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(step, dexter);

        var query = {
            origin:         step.input( 'origin' ).first(),
            destination:    step.input( 'destination' ).first(),
            avoid:          step.input( 'avoid' ).first(),
            language:       step.input( 'language' ).first(),
            units:          step.input( 'units' ).first(),
            traffic_model:  step.input( 'traffic_model' ).first(),
            transit_mode:   step.input( 'transit_mode' ).first(),
            transit_routing_preference: step.input( 'transit_routing_preference' ).first()
        };

        var gmAPI = new GoogleMapsAPI( auth );
        gmAPI.directions( query, function(err, result) {
            if (err)
                return this.fail(err);
            if (result && result.error_message)
                return this.fail(result.error_message);
            else
                return this.complete(result);
        }.bind(this));
    }
};

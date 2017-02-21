module.exports = {
    metersAndSecondsToMinutesPerMile: function(distanceMeters, movingTimeSeconds) {
        return (movingTimeSeconds / 60.0) / (distanceMeters / 1609.34);
    },
    
    metersToMiles: function(distanceMeters) {
        return distanceMeters / 1609.34;
    }
};
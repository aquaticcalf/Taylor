# Device sensors (primarily Android). On desktop/web, samples are zero and
# +accelerometer?+ / +gyroscope?+ / +magnetometer?+ return +false+.
#
# Units (Android): accelerometer m/s², gyroscope rad/s, magnetometer µT.
#
# @example Polling
#   a = Device.accelerometer
#   puts a.x, a.y, a.z
#
# @example Shake / tilt events (drained during Window.draw)
#   Device.on_shake { |intensity| puts "shake #{intensity}" }
#   Device.on_rotation { |pitch, yaw, roll| puts pitch, yaw, roll }
module Device
  # @!method self.accelerometer
  #   @return [Vector3]
  # @!method self.gyroscope
  #   @return [Vector3]
  # @!method self.magnetometer
  #   @return [Vector3]
  # @!method self.accelerometer?
  #   @return [Boolean]
  # @!method self.gyroscope?
  #   @return [Boolean]
  # @!method self.magnetometer?
  #   @return [Boolean]
  # @!method self.on_shake
  #   @yieldparam intensity [Float]
  # @!method self.on_rotation
  #   @yieldparam pitch [Float] radians
  #   @yieldparam yaw [Float] radians (0 without full fusion)
  #   @yieldparam roll [Float] radians
end

# A class used to hold an x, y, and z value (e.g. device sensors).
#
# @example Basic usage
#   v = Vector3[1, 2, 3]
#   puts v.x # => 1
#   puts v.y # => 2
#   puts v.z # => 3
class Vector3
  # A short form way to create new {Vector3} objects.
  #
  # @param x [Float]
  # @param y [Float]
  # @param z [Float]
  # @return [Vector3]
  def self.[](x, y, z)
    new(x: x, y: y, z: z)
  end

  # @param other [Vector3]
  # @return [Boolean]
  def ==(other)
    return super unless other.is_a?(Vector3)

    x == other.x && y == other.y && z == other.z
  end

  # @return [String]
  def to_s
    "Vector3[#{x}, #{y}, #{z}]"
  end
  alias_method :inspect, :to_s
}

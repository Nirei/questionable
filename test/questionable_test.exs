defmodule QuestionableTest do
  use ExUnit.Case
  doctest Questionable

  test "greets the world" do
    assert Questionable.hello() == :world
  end
end

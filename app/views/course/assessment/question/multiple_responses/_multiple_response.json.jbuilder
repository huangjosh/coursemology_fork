# frozen_string_literal: true
json.autogradable question.auto_gradable?

json.options question.options do |option|
  json.option format_html(option.option)
  json.id option.id
  json.correct option.correct if can_grade
end

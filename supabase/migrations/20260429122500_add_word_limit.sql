-- Add word_limit field to questions table
ALTER TABLE questions ADD COLUMN word_limit INTEGER DEFAULT NULL;

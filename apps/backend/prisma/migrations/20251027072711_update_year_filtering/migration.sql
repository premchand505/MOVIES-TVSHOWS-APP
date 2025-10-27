-- DropIndex
DROP INDEX `Movie_title_director_type_idx` ON `Movie`;

-- CreateIndex
CREATE FULLTEXT INDEX `Movie_title_director_type_year_idx` ON `Movie`(`title`, `director`, `type`, `year`);

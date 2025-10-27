-- CreateIndex
CREATE FULLTEXT INDEX `Movie_title_director_type_idx` ON `Movie`(`title`, `director`, `type`);

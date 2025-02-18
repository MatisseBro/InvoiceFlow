<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250218126759 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('INSERT INTO user (email, roles, password) VALUES ( "matisse@gmail.com","[\"ROLE_ADMIN\"]", "$2y$13$Ppzv8DAhZ6xyS5mIuTsYH.Mb8f4YD/AQinxOEJ8U2ChC.azcmaASC")');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}

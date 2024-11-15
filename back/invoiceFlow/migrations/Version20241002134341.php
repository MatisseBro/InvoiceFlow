<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241002134341 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produits_facture ADD facture_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE produits_facture ADD CONSTRAINT FK_C714C6C97F2DEE08 FOREIGN KEY (facture_id) REFERENCES facture (id)');
        $this->addSql('CREATE INDEX IDX_C714C6C97F2DEE08 ON produits_facture (facture_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produits_facture DROP FOREIGN KEY FK_C714C6C97F2DEE08');
        $this->addSql('DROP INDEX IDX_C714C6C97F2DEE08 ON produits_facture');
        $this->addSql('ALTER TABLE produits_facture DROP facture_id');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241002133908 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produits_devis ADD devis_id INT DEFAULT NULL, ADD produit_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE produits_devis ADD CONSTRAINT FK_FE50B16541DEFADA FOREIGN KEY (devis_id) REFERENCES devis (id)');
        $this->addSql('ALTER TABLE produits_devis ADD CONSTRAINT FK_FE50B165F347EFB FOREIGN KEY (produit_id) REFERENCES produits (id)');
        $this->addSql('CREATE INDEX IDX_FE50B16541DEFADA ON produits_devis (devis_id)');
        $this->addSql('CREATE INDEX IDX_FE50B165F347EFB ON produits_devis (produit_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produits_devis DROP FOREIGN KEY FK_FE50B16541DEFADA');
        $this->addSql('ALTER TABLE produits_devis DROP FOREIGN KEY FK_FE50B165F347EFB');
        $this->addSql('DROP INDEX IDX_FE50B16541DEFADA ON produits_devis');
        $this->addSql('DROP INDEX IDX_FE50B165F347EFB ON produits_devis');
        $this->addSql('ALTER TABLE produits_devis DROP devis_id, DROP produit_id');
    }
}

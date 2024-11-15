<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241002131659 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE produits_facture (id INT AUTO_INCREMENT NOT NULL, devis_id INT DEFAULT NULL, produit_id INT DEFAULT NULL, quantite INT NOT NULL, montant INT NOT NULL, INDEX IDX_C714C6C941DEFADA (devis_id), INDEX IDX_C714C6C9F347EFB (produit_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE produits_facture ADD CONSTRAINT FK_C714C6C941DEFADA FOREIGN KEY (devis_id) REFERENCES devis (id)');
        $this->addSql('ALTER TABLE produits_facture ADD CONSTRAINT FK_C714C6C9F347EFB FOREIGN KEY (produit_id) REFERENCES produits (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produits_facture DROP FOREIGN KEY FK_C714C6C941DEFADA');
        $this->addSql('ALTER TABLE produits_facture DROP FOREIGN KEY FK_C714C6C9F347EFB');
        $this->addSql('DROP TABLE produits_facture');
    }
}

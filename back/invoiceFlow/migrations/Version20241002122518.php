<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241002122518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE devis (id INT AUTO_INCREMENT NOT NULL, numero_devis INT NOT NULL, date_envoie DATE NOT NULL, montant_total INT NOT NULL, statut VARCHAR(255) NOT NULL, montant_taxe INT NOT NULL, montant_remise INT NOT NULL, date_creation DATE NOT NULL, est_accepter TINYINT(1) NOT NULL, condition_reglement VARCHAR(255) NOT NULL, commentaire_reglement VARCHAR(255) NOT NULL, date_validite DATE NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE devis');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250313091747 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise CHANGE nom_entreprise nom_entreprise VARCHAR(255) DEFAULT NULL, CHANGE numero_telephone numero_telephone INT DEFAULT NULL, CHANGE adresse1 adresse1 VARCHAR(255) DEFAULT NULL, CHANGE code_postal code_postal VARCHAR(255) DEFAULT NULL, CHANGE ville ville VARCHAR(255) DEFAULT NULL, CHANGE pays pays VARCHAR(255) DEFAULT NULL, CHANGE siret siret VARCHAR(255) DEFAULT NULL, CHANGE siren siren VARCHAR(255) DEFAULT NULL, CHANGE iban iban VARCHAR(255) DEFAULT NULL, CHANGE bic bic VARCHAR(255) DEFAULT NULL, CHANGE nom_banque nom_banque VARCHAR(255) DEFAULT NULL, CHANGE swift swift VARCHAR(255) DEFAULT NULL, CHANGE condition_reglement condition_reglement VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise CHANGE nom_entreprise nom_entreprise VARCHAR(255) NOT NULL, CHANGE numero_telephone numero_telephone INT NOT NULL, CHANGE adresse1 adresse1 VARCHAR(255) NOT NULL, CHANGE code_postal code_postal VARCHAR(255) NOT NULL, CHANGE ville ville VARCHAR(255) NOT NULL, CHANGE pays pays VARCHAR(255) NOT NULL, CHANGE siret siret VARCHAR(255) NOT NULL, CHANGE siren siren VARCHAR(255) NOT NULL, CHANGE iban iban VARCHAR(255) NOT NULL, CHANGE bic bic VARCHAR(255) NOT NULL, CHANGE nom_banque nom_banque VARCHAR(255) NOT NULL, CHANGE swift swift VARCHAR(255) NOT NULL, CHANGE condition_reglement condition_reglement VARCHAR(255) NOT NULL');
    }
}

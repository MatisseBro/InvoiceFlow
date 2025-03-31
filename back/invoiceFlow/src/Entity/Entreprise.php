<?php

namespace App\Entity;

use App\Repository\EntrepriseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EntrepriseRepository::class)]
class Entreprise
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nomEntreprise = null;

    #[ORM\Column(nullable: true)]
    private ?int $numeroTelephone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse1 = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse2 = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $codePostal = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ville = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pays = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siret = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siren = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $iban = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bic = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nomBanque = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $swift = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $conditionReglement = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $commentaireReglement = null;

    /**
     * @var Collection<int, Client>
     */
    #[ORM\OneToMany(targetEntity: Client::class, mappedBy: 'entreprise')]
    private Collection $clients;

    /**
     * @var Collection<int, User>
     */
    #[ORM\OneToMany(targetEntity: User::class, mappedBy: 'entreprise')]
    private Collection $users;

    /**
     * @var Collection<int, Produits>
     */
    #[ORM\OneToMany(targetEntity: Produits::class, mappedBy: 'entreprise')]
    private Collection $produits;

    public function __construct()
    {
        $this->clients = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->produits = new ArrayCollection();
    }

    // -- Getters / Setters --

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomEntreprise(): ?string
    {
        return $this->nomEntreprise;
    }

    public function setNomEntreprise(?string $nomEntreprise): static
    {
        $this->nomEntreprise = $nomEntreprise;
        return $this;
    }

    public function getNumeroTelephone(): ?int
    {
        return $this->numeroTelephone;
    }

    public function setNumeroTelephone(?int $numeroTelephone): static
    {
        $this->numeroTelephone = $numeroTelephone;
        return $this;
    }

    public function getAdresse1(): ?string
    {
        return $this->adresse1;
    }

    public function setAdresse1(?string $adresse1): static
    {
        $this->adresse1 = $adresse1;
        return $this;
    }

    public function getAdresse2(): ?string
    {
        return $this->adresse2;
    }

    public function setAdresse2(?string $adresse2): static
    {
        $this->adresse2 = $adresse2;
        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }

    public function setCodePostal(?string $codePostal): static
    {
        $this->codePostal = $codePostal;
        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(?string $ville): static
    {
        $this->ville = $ville;
        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(?string $pays): static
    {
        $this->pays = $pays;
        return $this;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): static
    {
        $this->siret = $siret;
        return $this;
    }

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(?string $siren): static
    {
        $this->siren = $siren;
        return $this;
    }

    public function getIban(): ?string
    {
        return $this->iban;
    }

    public function setIban(?string $iban): static
    {
        $this->iban = $iban;
        return $this;
    }

    public function getBic(): ?string
    {
        return $this->bic;
    }

    public function setBic(?string $bic): static
    {
        $this->bic = $bic;
        return $this;
    }

    public function getNomBanque(): ?string
    {
        return $this->nomBanque;
    }

    public function setNomBanque(?string $nomBanque): static
    {
        $this->nomBanque = $nomBanque;
        return $this;
    }

    public function getSwift(): ?string
    {
        return $this->swift;
    }

    public function setSwift(?string $swift): static
    {
        $this->swift = $swift;
        return $this;
    }

    public function getConditionReglement(): ?string
    {
        return $this->conditionReglement;
    }

    public function setConditionReglement(?string $conditionReglement): static
    {
        $this->conditionReglement = $conditionReglement;
        return $this;
    }

    public function getCommentaireReglement(): ?string
    {
        return $this->commentaireReglement;
    }

    public function setCommentaireReglement(?string $commentaireReglement): static
    {
        $this->commentaireReglement = $commentaireReglement;
        return $this;
    }

    /**
     * @return Collection<int, Client>
     */
    public function getClients(): Collection
    {
        return $this->clients;
    }

    public function addClient(Client $client): static
    {
        if (!$this->clients->contains($client)) {
            $this->clients->add($client);
            $client->setEntreprise($this);
        }
        return $this;
    }

    public function removeClient(Client $client): static
    {
        if ($this->clients->removeElement($client)) {
            // set the owning side to null (unless already changed)
            if ($client->getEntreprise() === $this) {
                $client->setEntreprise(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setEntreprise($this);
        }
        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getEntreprise() === $this) {
                $user->setEntreprise(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Produits>
     */
    public function getProduits(): Collection
    {
        return $this->produits;
    }

    public function addProduit(Produits $produit): static
    {
        if (!$this->produits->contains($produit)) {
            $this->produits->add($produit);
            $produit->setEntreprise($this);
        }

        return $this;
    }

    public function removeProduit(Produits $produit): static
    {
        if ($this->produits->removeElement($produit)) {
            // set the owning side to null (unless already changed)
            if ($produit->getEntreprise() === $this) {
                $produit->setEntreprise(null);
            }
        }

        return $this;
    }
}

### Attack Surface

#### SSRF Attack

The `backend` service is susceptible to an SSRF attack that can be used to fetch any non-https URL. This vulnerability
is available on the `/api/archives` endpoint when supplying the `archiveURL` parameter.

#### Emulated RCE
The `frontend` service allows arbitrary command execution with an authenticated endpoint. This emulates an RCE without exposing one directly to the internet.

To access this exploit, simply use the `Auth` link in the top-right corner of the UI. Provide the `auth_token` that can
be retrieved with the `detc deployments ecomm-reporter reporter-auth-details auth_token` command.


### Automated Attacks

The attacks are the same, regardless of deployment type. All attacks require the attack workers to be deployed.


#### Deploy attack infra

To deploy the attack infrastructure:

```
detc create --plan https://raw.githubusercontent.com/ipcrm/pandoras-box/main/deploy/plans/aws/attacker-infra.yml --apply
```

The attack infrastructure creates three instances in AWS that are `t2.micro`. The default regions for these instances
are `eu-central-1,ap-northeast-3,ap-south-1`. To change these regions, update the `ecomm-reporter.attack_regions`
secret, i.e., `detc secret set ecomm-reporter.attack_regions <new values comma separated>`. The attack instances are
used to launch all automated attacks.


#### Attack Details

* Instance discovery
  * Using the RCE emulation endpoint, the system is enumerated. If the target is a containerized deployment, additional
    enumeration (including attempting pod escape) is performed.
  * To execute: `detc run --plan https://raw.githubusercontent.com/ipcrm/pandoras-box/main/attacks/workload-discovery.yml --apply`
* Get Credentials
  * An SSRF attack is launched and used to get instance credentials from the metadata service
  * To execute: `detc run --plan https://raw.githubusercontent.com/ipcrm/pandoras-box/main/attacks/ssrf-get-creds.yml --trace --apply`
  * > Note: use trace logging to see credentials in output
* AWS Discovery
  * An SSRF attack is launched and used to get instance credentials from the metadata service. The stolen credentials
    are then used to enumerate the account from multiple locations.
  * To execute: `detc run --plan https://raw.githubusercontent.com/ipcrm/pandoras-box/main/attacks/ssrf-run-discovery.yml --apply`
* RDS Ransomware
  * Note, must deploy using one of the RDS instance deployment types
  * An SSRF attack is launched and used to get instance credentials. The stolen credentials are used to enumerate RDS
    instances, create temporary CMKs, and ultimately destroy a target database and remove backups except for an
    encrypted copy using a temporary CMK.
  * To execute: `detc run --plan https://raw.githubusercontent.com/ipcrm/pandoras-box/main/attacks/ssrf-db-ransomware.yml --apply`

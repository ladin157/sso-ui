#!/bin/bash -e

NEW_VERSION=$1
mvn --file=./sso-theme/pom.xml versions:set -DnewVersion=$NEW_VERSION -DgenerateBackupPoms=false -DgroupId=com.vinorsoft.sso* -DartifactId=*
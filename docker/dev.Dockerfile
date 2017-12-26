# This follows https://dev-assembl.bluenove.com/static/techdocs/INSTALL.html#setup-a-development-environment
FROM ubuntu:xenial

RUN apt-get update && apt-get install -y \
    fabric \
    git \
    openssh-server \
# USING SUDO  IN DOCKER IS BAD
    sudo \
# NOT IN THE DOCS
    lsb-release \
# for add-apt-repository
    python-software-properties \
    software-properties-common \
    curl \
# clear the image cache
&& rm -rf /var/lib/apt/lists/*

WORKDIR /assembl

# THIS IS FWEIRD
RUN  useradd -m -U -G www-data assembl_user && \
            ssh-keygen -P '' -f ~/.ssh/id_rsa && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys && \
# USING SUDO  IN DOCKER IS BAD
            sudo -u assembl_user -i sh -c "cd && mkdir .ssh && ssh-keygen -P '' -f .ssh/id_rsa && cat .ssh/id_rsa.pub >> .ssh/authorized_keys" && \
            cat ~/.ssh/id_rsa.pub >> ~assembl_user/.ssh/authorized_keys

# NOT IN THE DOCS
RUN touch empty.rc

COPY ./fabfile.py .

# STARTING A SSH SERVER TO INSTALL STUFF IS FWEIRD
RUN /etc/init.d/ssh start && ssh-keyscan localhost \
  && fab -c empty.rc install_assembl_server_deps

# f this
RUN echo 'assembl_user ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers

# mehh
RUN  useradd -m -U postgres
